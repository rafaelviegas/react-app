import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import InputCustom from './InputCustom';
import ButtonCustom from './ButtonCustom';
import ErrorsHandler from './ErrorsHandler';
import SelectCustom from './SelectCustom';

class FormularioLivro extends Component {

    constructor() {
        super();
        this.state = { autores:[], titulo: '', preco: '', autorId: '' };
    }
    componentDidMount(){
        $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: 'json',
            success: function (data) {
                this.setState({ autores: data });
           
            }.bind(this)
        }); 
        PubSub.subscribe('select-autor', (topic,value) => {
            this.setState({ autorId: value });
            console.log(this);
        }); 
    }

    enviaForm(event) {
        event.preventDefault();

        $.ajax({
            url: "http://localhost:8080/api/livros",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId }),
            success: (data) => {
                PubSub.publish('atualiza-lista-livros', data);
                this.setState({ titulo: '', preco: '', autorId: '' });
            },
            error: (data) => {

                if (data.status === 400) {
                    new ErrorsHandler().publish(data.responseJSON);
                }
            },
            beforeSend: () => PubSub.publish('limpa-erros', {})
        })
    }
    setTitulo = (event) => {
        this.setState({ titulo: event.target.value });
    }

    setPreco = (event) =>  {
        this.setState({ preco: event.target.value });

    }
    setAutor = (event) => {
        this.setState({ autorId: event.target.value })
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind(this)} method="post">
                    <InputCustom label="Titulo" id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} />
                    <InputCustom label="Preço" id="preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco} />
                    <SelectCustom label="Autor" id="autorId" name="autorId" value={this.state.autorId} lista={this.state.autores} onChange={this.setAutor}/>
                    <ButtonCustom type="submit" title="Gravar" />
                </form>
            </div>
        );
    }
}
class TabelaLivros extends Component {

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Preco</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.livros.map(livro => 
                                
                                (<tr key={livro.id}>
                                    <td>{livro.titulo}</td>
                                    <td>{livro.preco}</td>
                                    <td>{livro.autor.nome}</td>
                                </tr>)
                            )
                        }

                    </tbody>
                </table>
            </div>
        );
    }
}
export default class LivroBox extends Component {
    constructor() {
        super();
        this.state = {livros:[] }
    }

    componentDidMount(){
        $.ajax({
            url: "http://localhost:8080/api/livros",
            dataType: 'json',
            success: function (data) {
                this.setState({ livros: data });
            }.bind(this)
        });
        
        PubSub.subscribe('atualiza-lista-livros', (topic, data) => this.setState({ livros: data }));
        
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h3>Cadastro de Livros</h3>
                </div>

                <div className="content" id="content">
                    <FormularioLivro/>
                    <TabelaLivros livros={this.state.livros} />
                </div>
            </div>
        );
    }
}