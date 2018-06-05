module Router exposing (..)

import Navigation exposing (Location)
import UrlParser exposing (..)


type Route
    = Home


matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map Home top
        ]


parseLocation : Location -> Route
parseLocation location =
    case (parsePath matchers location) of
        Just route ->
            route

        Nothing ->
            Home


routeToUrl : Route -> String
routeToUrl route =
    case route of
        Home ->
            "/"
