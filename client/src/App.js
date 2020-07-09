import React from 'react';
import Table from './Table'
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

let memory_array = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H','I','I','J','J','K','K','L','L'];

Array.prototype.memory_tile_shuffle = function(){
  let i = this.length, j, temp;
  while(--i > 0){
      j = Math.floor(Math.random() * (i+1));
      temp = this[j];
      this[j] = this[i];
      this[i] = temp;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tileBoolArr : memory_array.map( e => false),
      memClick: [],
      timer : 0,
      firstClick: false,
      isClickable: true,
      interval: null,
      showTable: false
    }
    
    this.startTheGame = this.startTheGame.bind(this);
    this.resetTheGame = this.resetTheGame.bind(this);
    this.newBoard = this.newBoard.bind(this);
    this.memoryFlipTile = this.memoryFlipTile.bind(this);
    this.renderGame = this.renderGame.bind(this);
    this.showScores = this.showScores.bind(this);

    memory_array.memory_tile_shuffle()
    console.log(memory_array)

  }
  newBoard(){
    let output = '';
    memory_array.memory_tile_shuffle();
    for(let i = 0; i < memory_array.length; i++){
      output += <div id={"tile_"+ i} onClick={this.memoryFlipTile(this,memory_array[i])} ></div>;
    }
    return output;
  }

  startTheGame() {
    this.setState({
      firstClick: true,
      interval: setInterval(() => {this.setState({timer: this.state.timer+1})}, 1000),
      isClickable: false
    })
  }

  showScores() {
    this.setState({
      showTable: !this.state.showTable
    })
  }

  async resetTheGame() {
    clearInterval(this.state.interval)
      this.setState({
        tileBoolArr: memory_array.map(e => false),
        firstClick: false,
        isClickable: true,
        timer: 0,
        interval: null
      })
      await memory_array.memory_tile_shuffle();
  }

  async memoryFlipTile(e){
    if(this.state.isClickable) return;

    let arr = this.state.tileBoolArr
    if( e.target.id in this.state.memClick){
      console.log('dbl clcik')
      return;
    }
    arr[e.target.id] = true
    await this.setState({
      tileBoolArr: arr,
      memClick: [...this.state.memClick, e.target.id]
    })

    if(this.state.memClick.length === 2) {
      console.log("usao")
        if(memory_array[parseInt(this.state.memClick[0])] 
        === memory_array[parseInt(this.state.memClick[1])]) {
          this.setState({
            memClick: []
          })

          if(this.state.tileBoolArr.every(e => e)) {
            let finalTime = this.state.timer
            console.log(finalTime)
            alert("Sve si pogodio!");
            await axios.post('http://localhost:5000/add', {time: finalTime});
            this.resetTheGame();
            
          }
        } else {
          setTimeout(async () => {
            let arr2 = this.state.tileBoolArr
            arr2[parseInt(this.state.memClick[0])] = false
            arr2[parseInt(this.state.memClick[1])] = false
            await this.setState({
              memClick: [],
              tileBoolArr: [...arr2]
            })
          }, 300)
          
        }
    }
  }

  renderGame() {
    return (
      <div className="App container">
      
      <div className="form-inline startBtn d-flex justify-content-center">
        <button disabled={!this.state.isClickable} className="btn btn-primary" onClick={this.startTheGame}>start the game</button>
        <button disabled={this.state.isClickable} className="btn btn-danger" onClick={this.resetTheGame}>reset the game</button>

          <button disabled={!this.state.isClickable} className="btn btn-success" onClick={this.showScores}>
            show highscores
          </button>
          
      </div>
          <div className="timer alert alert-primary">Time: {this.state.timer} seconds</div>
          <div className="memory_board">
            {memory_array.map((e,i) => {
              return (
                <div key={"tile_"+ i} 
                id={i}
                value={i} 
                disabled={this.state.isClickable}
                onClick={this.memoryFlipTile}
                className={this.state.tileBoolArr[i] ? "whiteBgd memory_cell" : "memory_cell"}
                >
                  {this.state.tileBoolArr[i] && e}
                </div>
              )
            })}
          </div>
        </div>
    )

  }

  render() {
  return (
    <div className="container">
      {this.state.showTable ? <Table showGame={this.showScores}/> : this.renderGame()}
    </div>
  );
  }
}

export default App;
