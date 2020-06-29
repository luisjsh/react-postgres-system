import React from 'react'

import './image-carousel-add-style.scss'

class PhotoCarousel extends React.Component{ 
  
    constructor (props){
        super(props);
        this.state = {
            x: 0,
            url: false
        }
    }


componentDidMount(){
    console.log(this.props)
}

//---------------- Carrousel ----------------------
goLeft = () =>{

    let x = this.state.x + 50
    let y = 50 + (this.props.photos.length * - 100)
    x ===  100 ? //if x is bigger than 0 ill go back to 0
    this.setState({x: y}) : 
    this.setState({x: x})
}


goRight = () =>{
    let x = this.state.x - 50
    x === - 100 * (this.props.photos.length ) ?
    this.setState({x: 0}) : 
    this.setState({x: x})
}
//----------------------------------------------------------------------------


    render(){
        return(
            <div className='above-all'>
                <div className="image-scroll">
                        <div className="image-section">
                                <div className="image-press-section">
                                    <a>Presione para introducir la imagen</a>
                                </div>
                                
                        <label htmlFor="file" className='input-file' style={{width: '100%', background:  this.props.url ? 'url('+ this.props.url + ') center center / 100% no-repeat' : '' , border: '1px solid #DEDEDE', borderRadius: '4px' ,height: "350px" }}></label>
                        <input type='file' id='file' onChange={this.props.handleFile} multiple />
                        <div className='images'>
                            {
                                this.props.photos !== false ? <div className='image-slide' > 

                                   {
                                       this.props.photos.map( ({ id, file }) =>(
                                           <img key={id} src={file} value={file} onClick={this.props.photoChanger} className={this.props.url === file ? 'image-selected' : 'image' } style={{transform:'translateX('+this.state.x+'%)'}}></img>
                                      )) 
                                   }
                                


                                </div> : ''
                            }
                        {
                            this.props.photos ?     
                            <div className='image-buttons'>
                                <button id='go-left' onClick={this.goLeft}></button>
                                <button id='go-right' onClick={this.goRight}></button>
                            </div>
                            : ''
                        }                           
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PhotoCarousel