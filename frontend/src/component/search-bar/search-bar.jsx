import React, { Component } from 'react'

import './search-bar-style.scss'

class searchBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
                cursor: 0,
                 result: [{id: 0, name: 'prueba1'}, {id:1, name:'prueba2'}, {id:2, name: 'prueba3'}, {id:3, name:'prueba4'}]
        }
        this.handleFocus = React.createRef()
        this.handlePress = this.handlePress.bind(this)
    }

//--------------- handle the navigation with arrow keys -------------

   handlePress(e){

            //one bug, or minor error is that it doesn´t Re render immediately

        let { cursor } = this.state

        if (e.keyCode === 38 ){
            
            if( this.state.cursor > 0){ 
            let less = cursor - 1
            this.setState({cursor: less})
            }
            this.handleFocus.current.focus()

        } else if ( e.keyCode === 40){
            
            if ( this.state.cursor < this.state.result.length-1){ //if the result.length its equal to cursor ill cause an error, cursor always has to be lower
                let plus = cursor + 1
                this.setState({cursor: plus})
            }
                this.handleFocus.current.focus()
            
        }
    }



    render() {
        let {cursor} = this.state
        return (
            <div className='searchbar' onKeyDown={this.handlePress} tabIndex={0}>
                <div className='search-inputs' > 
                    <div className="search">
                        <input type="text"    tabIndex={0}/>
                    </div>
                    <div className="deleate-them" tabIndex={0}>

                    </div>
                    <div className="search-icon" tabIndex={0}>

                    </div>
                </div>

                <div className="search-results">
                    {
                        this.state.result.map( (item, id) =>(
                            <div key={item.id} className='result' tabIndex={0} ref={ cursor === id ? this.handleFocus : 'b'}>
                                { item.name }
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default searchBar
