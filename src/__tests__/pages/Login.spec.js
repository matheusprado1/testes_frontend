import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Login from "../../pages/Login";
import api from "../../services/api";
import MockAdapter from "axios-mock-adapter";


const mockHistory = jest.fn() //Para acessarmos se o push do history foi chamado
// criamos esse mock. O jest.fn() seria uma função vazia.


jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), //buscando o que está dentro do módulo
  Link: ({ children }) => children,
  useHistory: () => ({
    push: mockHistory,
  }),
}));

const apiMock = new MockAdapter(api);

describe("Login Page", () => {
  it("should be able to sign in", async () => {
    apiMock.onPost("/login").replyOnce(200, {});
    render(<Login authenticated={false} setAuthenticated={() => { }} />);
    //Quando tiver uma requisição do tipo post, retornaremos uma vez a resposta da api
    //e um objeto vazop

    const emailField = screen.getByPlaceholderText("Seu melhor email");
    const passwordField = screen.getByPlaceholderText("Uma senha bem segura");
    const buttonElement = screen.getByText("Enviar");



    fireEvent.change(emailField, { target: { value: "matheus@mail.com" } })
    fireEvent.change(passwordField, { target: { value: "Abcd1234@" } })

    fireEvent.click(buttonElement)


    // eslint-disable-next-line testing-library/await-async-utils
    waitFor(() => {
      expect(emailField).toHaveValue("matheus@mail.com");
      expect(passwordField).toHaveValue("Abcd1234@");
      expect(mockHistory).toHaveBeenCalledWith("/dashboard");
    })
  })
})

