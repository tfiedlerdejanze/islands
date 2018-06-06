module Components.Game exposing (..)

import Html exposing (Html, text, ul, li, div, h2, button, section)
import Html.Attributes exposing (class, style)
import List
import Json.Decode as Json
import Json.Decode.Pipeline exposing (decode, required)


-- MODEL


type alias Coord =
    ( Int, Int )


type alias Board =
    List Coord


type alias Model =
    { board : Board }


squareSize =
    64


tile : Int -> Int -> Html Msg
tile xPos yPos =
    div
        [ class ("cell cell-" ++ (toString xPos) ++ "-" ++ (toString yPos))
        ]
        [ div [ class "inner" ] [ text ((toString xPos) ++ "-" ++ (toString yPos)) ] ]


renderRow x =
    List.map
        (tile x)
        (List.range 1 10)


row x =
    div [ class "row" ] (renderRow x)


initialBoard : Board
initialBoard =
    [ ( 0, 0 ) ]


initialModel : Model
initialModel =
    { board = initialBoard }



-- UPDATE


type Msg
    = NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            model ! []



-- VIEW


renderBlankBoard =
    List.map row (List.range 1 10)


view : Model -> Html Msg
view model =
    case model.board of
        _ ->
            div [ class "grid" ] renderBlankBoard



-- DECODER
-- HTTP REQUESTS
