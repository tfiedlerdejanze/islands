module Main exposing (..)

import Html exposing (Html, text, div, h1, h2, ul, li, a, input)
import Html.Attributes exposing (class, href, style, classList, placeholder, type_, value)
import Html.Events exposing (onWithOptions, defaultOptions, onInput, onClick)
import Components.Game as Game
import Json.Decode
import Navigation
import Router exposing (Route(..))
import Phoenix.Socket
import Phoenix.Channel
import Phoenix.Push
import Json.Decode
import Json.Encode


socketServer : String
socketServer =
    "ws://localhost:4000/socket/websocket"



-- MODEL


type alias Model =
    { gameModel : Game.Model
    , phxSocket : Phoenix.Socket.Socket Msg
    , currentView : Router.Route
    , newMessage : String
    , messages : List String
    }


initialModel : Router.Route -> Model
initialModel route =
    { gameModel = Game.initialModel
    , newMessage = ""
    , messages = []
    , phxSocket = Phoenix.Socket.init socketServer
    , currentView = route
    }


init : Navigation.Location -> ( Model, Cmd Msg )
init location =
    let
        currentRoute =
            Router.parseLocation location

        ( model, cmds ) =
            update (NewLocation location) (initialModel currentRoute)
    in
        ( model, cmds )


userParams : String -> Json.Encode.Value
userParams name =
    let
        user_name =
            Json.Encode.string name
    in
        Json.Encode.object [ ( "screen_name", user_name ) ]



-- UPDATE


andThen : Msg -> ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
andThen msg ( model, cmd ) =
    let
        ( newmodel, newcmd ) =
            update msg model
    in
        newmodel ! [ cmd, newcmd ]


type Msg
    = GameMsg Game.Msg
    | PhoenixMsg (Phoenix.Socket.Msg Msg)
    | GameName String
    | JoinChannel String
    | LeaveChannel
    | ShowJoinedMessage String
    | ShowLeftMessage String
    | CreateGame String String
    | NewLocation Navigation.Location
    | NewRoute Router.Route


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GameMsg gameMsg ->
            let
                ( updatedModel, cmd ) =
                    Game.update gameMsg model.gameModel
            in
                ( { model | gameModel = updatedModel }, Cmd.map GameMsg cmd )

        GameName name ->
            let
                ( updatedModel, cmd ) =
                    Game.update (Game.Name name) model.gameModel
            in
                ( { model | gameModel = updatedModel }, Cmd.map GameMsg cmd )

        PhoenixMsg msg ->
            let
                ( phxSocket, phxCmd ) =
                    Phoenix.Socket.update msg model.phxSocket
            in
                ( { model | phxSocket = phxSocket }
                , Cmd.map PhoenixMsg phxCmd
                )

        JoinChannel name ->
            let
                channel_name =
                    "game:" ++ name

                channel =
                    Phoenix.Channel.init (channel_name)
                        |> Phoenix.Channel.withPayload (userParams name)
                        |> Phoenix.Channel.onJoin (always (ShowJoinedMessage channel_name))
                        |> Phoenix.Channel.onJoin (always (CreateGame channel_name name))
                        |> Phoenix.Channel.onClose (always (ShowLeftMessage channel_name))

                ( phxSocket, phxCmd ) =
                    Phoenix.Socket.join channel model.phxSocket
            in
                ( { model | phxSocket = phxSocket }
                , Cmd.map PhoenixMsg phxCmd
                )

        LeaveChannel ->
            let
                ( phxSocket, phxCmd ) =
                    Phoenix.Socket.leave "game:lobby" model.phxSocket
            in
                ( { model | phxSocket = phxSocket }
                , Cmd.map PhoenixMsg phxCmd
                )

        CreateGame channel player_name ->
            let
                push_ =
                    Phoenix.Push.init "new_game" channel

                ( phxSocket, phxCmd ) =
                    Phoenix.Socket.push push_ model.phxSocket
            in
                ( { model
                    | newMessage = ""
                    , phxSocket = phxSocket
                  }
                , Cmd.map PhoenixMsg phxCmd
                )

        ShowJoinedMessage channelName ->
            ( { model | messages = ("Joined channel " ++ channelName) :: model.messages }
            , Cmd.none
            )

        ShowLeftMessage channelName ->
            ( { model | messages = ("Left channel " ++ channelName) :: model.messages }
            , Cmd.none
            )

        NewLocation location ->
            let
                newRoute =
                    Router.parseLocation location
            in
                case newRoute of
                    _ ->
                        { model | currentView = newRoute } ! []

        NewRoute route ->
            { model | currentView = route } ! [ Navigation.modifyUrl (Router.routeToUrl route) ]


subscriptions : Model -> Sub Msg
subscriptions model =
    Phoenix.Socket.listen model.phxSocket PhoenixMsg



-- VIEW


onPreventDefaultClick : msg -> Html.Attribute msg
onPreventDefaultClick message =
    onWithOptions
        "click"
        { defaultOptions | preventDefault = True }
        (Json.Decode.succeed message)


onClickPage : Route -> Route -> List (Html.Attribute Msg)
onClickPage route current =
    let
        is_active =
            route == current
    in
        [ href (Router.routeToUrl route)
        , classList
            [ ( "link", True )
            , ( "link--active", is_active )
            ]
        , onPreventDefaultClick (NewRoute route)
        ]


header : Router.Route -> Html Msg
header current_view =
    div [ class "header" ]
        [ ul [ class "navigation" ]
            [ li [] [ a (onClickPage Home current_view) [ text "Home" ] ]
            , li [] [ a (onClickPage Game current_view) [ text "Board" ] ]
            ]
        ]


welcomeView : Model -> Html Msg
welcomeView model =
    div []
        [ h2 [] [ text "Welcome to _!" ]
        , input [ type_ "text", placeholder "Name", onInput GameName ] []
        , input [ type_ "button", value "Start game", onClick (JoinChannel model.gameModel.name) ] []
        ]


gameView : Game.Model -> Html Msg
gameView model =
    Html.map GameMsg (Game.view model)


pageView : Model -> Html Msg
pageView model =
    case model.currentView of
        Home ->
            welcomeView model

        Game ->
            gameView model.gameModel


view : Model -> Html Msg
view model =
    div [] [ header model.currentView, (pageView model) ]



-- MAIN


main : Program Never Model Msg
main =
    Navigation.program NewLocation
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
