import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import InputCustom from './InputCustom';
import ButtonCustom from './ButtonCustom';
import ErrorsHandler from './ErrorsHandler';

class FormularioAutor extends Component {
    constructor() {
        super();
        this.state = { nome: '', email: '', senha: '' };
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }
    enviaForm(event) {
        event.preventDefault();

        $.ajax({
            url: "http://localhost:8080/api/autores",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
            success: (data) => {
                PubSub.publish('atualiza-lista-autores',data);
                this.setState({ nome: '', email: '', senha: '' });
            },
            error: (data) => {
                if(data.status === 400){
                    new ErrorsHandler().publish(data.responseJSON);
                }
            },
            beforeSend: () => PubSub.publish('limpa-erros',{})
        })
    }
    setNome(event) {
        this.setState({ nome: event.target.value });
    }
    setEmail(event) {
        this.setState({ email: event.target.value });
    }
    setSenha(event) {
        this.setState({ senha: event.target.value });
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind(this)} method="post">
                    <InputCustom label="Nome" id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} />
                    <InputCustom label="Email" id="email" type="text" name="email" value={this.state.email} onChange={this.setEmail} />
                    <InputCustom label="Senha" id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} />
                    <ButtonCustom type="submit" title="Gravar" />
                </form>
            </div>
        );
    }
}

class TabelaAutores extends Component {

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map(function (autor) {
                                return (
                                    <tr key={autor.id}>
                                        <td>{autor.nome}</td>
                                        <td>{autor.email}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default class AutorBox extends Component {
    constructor() {
    super();
    this.state = { lista: [] };
  }
    componentDidMount() {
        
    $.ajax({
      url: "http://localhost:8080/api/autores",
      dataType: 'json',
      success: function (data) {
        this.setState({ lista: data });
      }.bind(this)
    });
    PubSub.subscribe('atualiza-lista-autores',function(topic,data){
        this.setState({lista:data})
    }.bind(this));
  }

    render() {
        return (
            <div>
                <FormularioAutor/>
                <TabelaAutores lista={this.state.lista}/>
            </div>
        );
    }
}