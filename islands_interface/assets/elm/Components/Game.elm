module Components.Game exposing (..)

import Html exposing (Html, text, ul, li, div, h2, button, section)
import Html.Attributes exposing (class)
import List
import Json.Decode as Json
import Json.Decode.Pipeline exposing (decode, required)


-- MODEL


type alias Model =
    { game_data : String }


initialModel : Model
initialModel =
    { game_data = "" }



-- UPDATE


type Msg
    = NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            model ! []



-- VIEW


view : Model -> Html Msg
view model =
    case model.game_data of
        _ ->
            div []
                [ h2 [] [ text "Game" ]
                , text "Loading"
                ]



-- DECODER
-- HTTP REQUESTS
