import React from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

//nova klasa
class Table extends React.Component {
  constructor(props) {
    super(props)
   this.state = {
       data: []
   }

  }

  //invoukuje se posle prvog renderovanja
  async componentDidMount() {
    const resTime = await axios.get('http://localhost:5000/');
    console.log(resTime.data)
    this.setState({
        data: [...resTime.data]
    })
  }

  render() {
  return (
    <div className="container ">
        <button className="btn btn-primary backBtn" onClick={this.props.showGame}>back to the game</button>
        
        <table className="table table-striped text-center">
            <thead>
                <tr>
                    <th scope='col'>Time:</th>
                </tr>
            </thead>
            <tbody>
                {this.state.data.map((e, i) => {
                    return (
                        <tr key={i}><td>{e.time} seconds</td></tr>
                    )
                })}
            </tbody>
        </table>
     
    </div>
  );
  }
}

export default Table;
