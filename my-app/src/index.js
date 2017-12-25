import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const rows = [1, 2, 3];
    const boardRows = rows.map(row => {
      const cols = [1, 2, 3];
      return (
        <div className="board-row">
          { cols.map(col => {
            return this.renderSquare(3*(row-1) + (col-1));
          }, this) }
        </div>
      );
    }, this);
    return <div>{ boardRows }</div>;
  }
}

class HistoryButton extends React.Component {
  render() {
    if (this.props.active) {
      return (
        <li key={this.props.move}>
          <button onClick={() => this.props.triggerJump(this.props.move)}><strong>{this.props.desc}</strong></button>
        </li>
      );
    } else {
      return (
        <li key={this.props.move}>
          <button onClick={() => this.props.triggerJump(this.props.move)}>{this.props.desc}</button>
        </li>
      );
    }
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        row: null, // store the move in each history
        col: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      activeIndex: null, // nothing should be active
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        row: Math.floor(i/3) + 1, // 1, 1
        col: i%3 + 1,
      }]), // keep the row, col here?
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    // jump to should bold it
    this.setState({
      activeIndex: step,
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);


    const moves = history.map((step, move) => {
      const desc = move ? 'Go to Move #' + move +
                          "  (" + history[move].row + ", " + history[move].col + ")" : 'Go to game start';
      return (
        <HistoryButton
            active={this.state.activeIndex === move}
            move={move}
            triggerJump={(i) => this.jumpTo(i)}
            desc={desc}
        />
      );
    });

    const toggle = <button onClick={() => {
      this.setState({
        revDisplay: true,
      });
    }}> Flip Move Order </button>

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares }
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{toggle}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
