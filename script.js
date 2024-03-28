// Selecting DOM Elements
const addMatchBtn = document.querySelector(".add-match");
const totalCount = document.querySelector(".total-count");
const resetBtn = document.querySelector(".reset");
const matchContainer = document.querySelector(".match-container");

// Initial State
const initialState = [{ id: 1, score: 0 }];

// Action Identifier
const ADD_MATCH = "addmatch";
const DEL_MATCH = "deletematch";
const INCREMENT = "increment";
const DECREMENT = "decrement";
const RESET = "reset";

// Action Creators
const addMatch = () => {
  return {
    type: ADD_MATCH,
  };
};
const deleteMatch = (id) => {
  return {
    type: DEL_MATCH,
    payload: id,
  };
};
const incrementMatch = (id, value) => {
  return {
    type: INCREMENT,
    payload: {
      id,
      value,
    },
  };
};
const decrementMatch = (id, value) => {
  return {
    type: DECREMENT,
    payload: {
      id,
      value,
    },
  };
};

const resetData = () => {
  return {
    type: RESET,
  };
};
// Maximum ID Creator
const uniqueId = (matchs) => {
  const maxId = matchs.reduce((maxId, match) => Math.max(match.id, maxId), 0);
  return maxId + 1;
};
// Reducer Function
function matchReducer(state = initialState, action) {
  if (action.type === ADD_MATCH) {
    const id = uniqueId(state);
    return [
      ...state,
      {
        id,
        score: 0,
      },
    ];
  } else if (action.type === DEL_MATCH) {
    return state.filter((match) => match.id !== action.payload);
  } else if (action.type === INCREMENT) {
    return [...state].map((match) => {
      if (match.id === action.payload.id) {
        return {
          ...match,
          score: Number(match.score) + Number(action.payload.value),
        };
      } else {
        return match;
      }
    });
  } else if (action.type === DECREMENT) {
    return [...state].map((match) => {
      if (match.id === action.payload.id) {
        const updateScore = Number(match.score) - Number(action.payload.value);
        return {
          ...match,
          score: updateScore < 0 ? 0 : updateScore,
        };
      } else {
        return match;
      }
    });
  } else if (action.type === RESET) {
    return [...state].map((match) => ({ ...match, score: 0 }));
  } else {
    return state;
  }
}

// Create Store
const store = Redux.createStore(matchReducer);

const render = () => {
  const state = store.getState();
  const matchState = state
    .map((match) => {
      return `
  <div class="match">
  <div class="delete-container">
    <img src="images/remove.png" alt="close" class="delete" onclick="deleteHandler(${match.id})"/>
    <h2>Match ${match.id}</h2>
  </div>
  <div class="input-area">
    <form onsubmit="incrementHandler(event, ${match.id})">
      <h2>Increment</h2>
      <input type="text" class="increment" />
    </form>
    <form onsubmit="decrementHandler(event, ${match.id})">
      <h2>Decrement</h2>
      <input type="text" class="decrement" />
    </form>
    <div class="total-count">${match.score}</div>
  </div>
</div>`;
    })
    .join("");
  matchContainer.innerHTML = matchState;
};

render();
store.subscribe(render);

// Dispatch

addMatchBtn.addEventListener("click", () => {
  store.dispatch(addMatch());
});

resetBtn.addEventListener("click", () => {
  store.dispatch(resetData());
});

const deleteHandler = (id) => {
  store.dispatch(deleteMatch(id));
};

const incrementHandler = (event, id) => {
  event.preventDefault();
  const payload = event.target.querySelector(".increment").value;
  store.dispatch(incrementMatch(id, payload));
  console.log(payload);
};

const decrementHandler = (event, id) => {
  event.preventDefault();
  const payload = event.target.querySelector(".decrement").value;
  store.dispatch(decrementMatch(id, payload));
  console.log(payload);
};
