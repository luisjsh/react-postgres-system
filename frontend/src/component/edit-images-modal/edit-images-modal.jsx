import React, { Component } from 'react'
import { connect } from 'react-redux'

import './edit-images-modal-styles.scss'

import Modal from '../modal/modalComponent'

class EditImageModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image: this.props.images[0] !== undefined ?  this.props.images : false ,
            currentUrl: false
        }
        
        this.inputHandler = this.inputHandler.bind(this);  
    }

    async inputHandler(event){
        if (event.target.files !== undefined ){
            let i = 0;
            
            let imagesWithUrl = [...event.target.files].map( item => {
                return URL.createObjectURL(item)
            })

            this.setState({currentUrl: imagesWithUrl[0] , image: imagesWithUrl })
        } 
    }

    render() {
        return (
            <Modal handleClick={this.props.DontShow} >
                <div className="container">
                    <button className='x-button'>
                    </button>
                    <div className="img-displayed" >
                        <img src={this.state.currentUrl} ></img>
                        <div className="background" style={{backgroundImage:' url('+this.state.currentUrl+')'}}></div>
                    </div>
                    <div className="image-controller-section">
                        <div className="input">
                            <label htmlFor='fileEdit'>Agregar Imagen</label>
                            <input type='file' id='fileEdit' onChange={this.inputHandler} />
                        </div>
                        <div className="images-thumbnails">
                            {
                                this.state.image == true ?

                                <div>jnaskjdnaskjdn</div>

                                :

                                <div className="no-images">
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

const mapStatetoProps = ({item: {images} })=>{
    return {
        images
    }
}

export default connect (mapStatetoProps) (EditImageModal)
