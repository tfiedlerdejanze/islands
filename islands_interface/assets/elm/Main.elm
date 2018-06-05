module Main exposing (..)

import Html exposing (Html, text, div, h1, h2, ul, li, a)
import Html.Attributes exposing (class, href, style, classList)
import Html.Events exposing (onWithOptions, defaultOptions)
import Json.Decode
import Navigation
import Router exposing (Route(..))


-- MODEL


type alias Model =
    { currentView : Router.Route
    }


initialModel : Router.Route -> Model
initialModel route =
    { currentView = route
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



-- UPDATE


type Msg
    = NewLocation Navigation.Location
    | NewRoute Router.Route


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
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
    Sub.none



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
            ]
        ]


welcomeView : Html Msg
welcomeView =
    h2 [] [ text "Welcome to _!" ]


pageView : Model -> Html Msg
pageView model =
    case model.currentView of
        Home ->
            welcomeView


view : Model -> Html Msg
view model =
    div [] [ header model.currentView, div [ class "main" ] [ pageView model ] ]



-- MAIN


main : Program Never Model Msg
main =
    Navigation.program NewLocation
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
