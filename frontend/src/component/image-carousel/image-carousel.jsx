import React, { Component } from 'react'
import { connect } from 'react-redux' 

import './image-carousel-style.scss'

class ImageCarousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
             choosedImage: null,
             x: 0,
             imageId: 0
        }
        this.goRight = this.goRight.bind(this);
        this.goLeft = this.goLeft.bind(this);
        this.selectImage = this.selectImage.bind(this);
    }

//------------- go to right image ---------------

    goRight(){
       if ( this.state.imageId < this.props.images.length - 1 ){
        let right = this.state.imageId + 1;
        let rightImage = this.state.x - 100;
        this.setState({imageId: right, x: rightImage})
       }
    }

//------------- go to left image --------------

    goLeft(){
        if ( this.state.imageId > 0 ){
            let left = this.state.imageId - 1;
            let leftImage = this.state.x + 100;
            this.setState({imageId: left, x: leftImage})
           }
    }

//------------- select image ------------------


    selectImage (event){
        let x = - (event.target.attributes.value.value * 100)
        this.setState({imageId: parseInt(event.target.attributes.value.value) , x})
    }



    render() {
        return (
            <div className='carousel'>
                <div className="image">
                
                
                {this.props.images && this.props.images.length > 1  ? <button id='right' onClick={this.goRight}></button>  : ''}

                
                {this.props.images  && this.state.x !== 0 ? <button id='left'  onClick={this.goLeft} ></button> : ''}
                
                    {
                         this.props.images.length > 0 ? 
                        
                        this.props.images.map( ({ id , path })  => (
                            <img key={id} src={'http://localhost:4000'+ path} className='slides' style={{transform:'translateX('+this.state.x+'%)', zIndex: '-1'}} />
                        ))

                        :

                        <div className='slides'></div>
                    }

                </div>
                {
                    
                     this.props.images ? 
                    
                    this.props.images.map( ({ id, path }, idValue)=>(
                        <img key={id} src={'http://localhost:4000'+ path} value={idValue}  className={ this.state.imageId === idValue ? 'selected-image' : 'tiny-slides' } onClick={this.selectImage} />
                    ))
                
                     :
                     
                     ''
                
                }
            </div>
        )
    }
}

const mapStatetoProps = ({ item: { images } })=>{
    return{
        images
    }
}

export default connect (mapStatetoProps) (ImageCarousel)
