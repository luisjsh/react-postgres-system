import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';


import './search-bar-style.scss'

class searchBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
                searchbar: '',
                cursor: 0,
                 result: []
        }
        this.handleFocus = React.createRef();
        this.handlePress = this.handlePress.bind(this);
        this.formHandler = this.formHandler.bind(this);
        this.fetchResults = this.fetchResults.bind(this)
    }

//--------------- handle the navigation with arrow keys -------------

   handlePress(e){

    let { cursor } = this.state

        if (e.keyCode === 38 ){
            e.preventDefault()
            if( this.state.cursor > 0){ 
            let less = cursor - 1
            this.setState({cursor: less})
            }
            this.handleFocus.current.focus()

        } else if ( e.keyCode === 40){
            e.preventDefault()
            if ( this.state.cursor < this.state.result.length-1){ //if the result.length its equal to cursor ill cause an error, cursor always has to be lower
                let plus = cursor + 1
                this.setState({cursor: plus})
            }
                this.handleFocus.current.focus()
            
        }
    }

   
    formHandler(event) {
        let { name, value } = event.target;
        this.fetchResults(value)
        this.setState({ [name]: value });
    }

    handleEnterKeyPress(value){
        this.props.history.push('/search/'+value)
    }

    async fetchResults(value){

        if(value.length > 0){

            await fetch('http://localhost:4000/search/'+value)
                .then( async Response =>{
                    let { response } = await Response.json()

                    if( response.length > 6){
                        response.length = 6
                    }

                    this.setState({result: response})
                })

        }
    }

    render() {
        let {cursor} = this.state
        return (
            <div className='searchbar' onKeyDown={this.handlePress}>
                <div className='search-inputs' > 
                    <div className="search">
                        <input type="text" name='searchbar' onChange={this.formHandler} onKeyDown={(e)=>{ if(e.keyCode =='13'){this.handleEnterKeyPress(this.state.searchbar)} }} value={this.state.searchbar} ref={ this.handleFocus } tabIndex={0}/>
                    </div>
                    <div className="deleate-them" onClick={ ()=>this.setState({searchbar: '' , result: []}) } tabIndex={0}>

                    </div>
                    <div className="search-icon" tabIndex={0}>

                    </div>
                </div>

                <div className="search-results">
                    {
                        this.state.result.map( (item, id) =>(
                            <div key={item.id} className='result' tabIndex={0} onClick={(e)=>{ e.preventDefault(); this.handleEnterKeyPress(item.nombre) }}  onKeyDown={(e)=>{ if(e.keyCode =='13'){this.handleEnterKeyPress(item.nombre)} }} ref={ cursor === id ? this.handleFocus : ''}>
                                { item.nombre }
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default withRouter(searchBar)
