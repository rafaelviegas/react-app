import PubSub from 'pubsub-js';

export default class ErrorsHandler {
    
    publish(data){
       data.errors.forEach(error => {
            PubSub.publish('erro-validacao', error);
       });
       
    }
}