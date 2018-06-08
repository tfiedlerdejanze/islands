module Components.Game exposing (..)

import Html exposing (Html, text, ul, li, div, h2, button, section)
import Html.Attributes exposing (class, style)
import List
import Json.Decode as Json
import Json.Decode.Pipeline exposing (decode, required)


-- MODEL


type alias Coord =
    ( Int, Int )


type alias Model =
    { selected : Coord
    , state : String
    , name : String
    }


cell : Int -> Int -> Html Msg
cell xPos yPos =
    div [ class "cell" ]
        [ div [ class "inner" ]
            [ text ((toString xPos) ++ "-" ++ (toString yPos)) ]
        ]


renderRow : Int -> List (Html Msg)
renderRow x =
    List.map (cell x) (List.range 1 10)


row : Int -> Html Msg
row x =
    div [ class "row" ] (renderRow x)


initialModel : Model
initialModel =
    { selected = ( 1, 1 )
    , state = "initialized"
    , name = ""
    }



-- UPDATE


type Msg
    = NoOp
    | Name String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Name name ->
            { model | name = name } ! []

        NoOp ->
            model ! []



-- VIEW


renderBlankBoard : List (Html Msg)
renderBlankBoard =
    List.map row (List.range 1 10)


view : Model -> Html Msg
view model =
    div [ class "grid" ] renderBlankBoard



-- DECODER
-- HTTP REQUESTS
