import React, { Component } from 'react'

import './card-carousel-style.scss'

class cardsCarousel extends Component {
    constructor(props) {
        super(props)

        this.state = {
                 x: 0
        }

        this.goRight = this.goRight.bind(this);
        this.goLeft = this.goLeft.bind(this);

    }


//------------- go to right image ---------------

    goRight(){
        if ( (this.props.itemArray.length *  - 25) + 25 < this.state.x ) {

           let x = this.state.x - 25;
            this.setState({x : x})
        }
    }
    

//------------- go to left image --------------

    goLeft(){
        this.setState({x : 0})
    }
    



    render() {
        return (
                <div className='cards-carousel'>
                    <div className="cards-section" >
                    <span className='title-span'>{this.props.title}</span>
                        <div className="card" style={{transform:'translateX('+this.state.x+'%)'}}>
                            {this.props.children}
                    </div>
                    </div>
                        {
                        this.state.x !== 0 ? <button id='goLeft' onClick={this.goLeft}></button> : ''
                        }
                        {
                         this.props.itemArray !== undefined  ? 
                        
                           this.props.itemArray.length > 1 ? <button id='goRight' onClick={this.goRight}></button>  : ''
                        
                             
                            : ''
                        }
                </div>  
        )
    }
}

export default cardsCarousel
