
defmodule IslandsInterfaceWeb.GameController do
  use IslandsInterfaceWeb, :controller

  alias IslandsEngine.GameSupervisor

  def start_game(conn, %{"name" => name}) do
    {:ok, _pid} = GameSupervisor.start_game(name)
    conn
    |> put_flash(:info, "You entered the name: " <> name)
    |> render("index.html", name: name)
  end
end
