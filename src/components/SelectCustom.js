import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class SelectCustom extends Component {

    constructor() {
        super();
        this.state = {error: ''};
    }

    componentDidMount(){
          
        PubSub.subscribe('erro-validacao', (topic,data) => {
            if(data.field === this.props.name){
                this.setState({error: data.defaultMessage});
            }
        });

        PubSub.subscribe('limpa-erros', topic =>  this.setState({error:''}))
        
    }
    change = (event) => {
        this.props.onChange(event);
    }

    render() {
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <select id={this.props.id} name={this.props.name} value={this.props.value} onChange={this.change}>
                    <option value=''>Selecione</option>
                    {
                        this.props.lista.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)
                    }
                </select>
                <span>{this.state.error}</span>
            </div>
        )
    }

} 
