import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class InputCustom extends Component{

constructor(){
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
    render(){
        return (

        <div className="pure-control-group">
            <label htmlFor={this.props.id}>{this.props.label}</label> 
            <input id={this.props.id} type={this.props.type} name={this.props.nome} value={this.props.value} onChange={this.props.onChange}  />                  
            <span>{this.state.error}</span>
        </div>
        );
    }

}


