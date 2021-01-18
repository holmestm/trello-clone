import { nanoid } from "nanoid";
import React, { createContext, useReducer, useContext } from "react";
import { DragItem } from "./DragItem";
import { findItemIndexById, moveItem, overrideItemAtIndex } from "./utils/arrayUtils";

// creates a state provider which can be referenced by individual components with a call
// const { state, dispatch } = useAppState();
// state is an object that implements the interface AppState
// dispatch is a function which takes AppStateContextProps as it's argument - aka a pointer to useReducer function below

interface Task {
  id: string,
  text: string
}

interface List {
  id: string,
  text: string,
  tasks: Task[]
}

// this inteface describes the state of the entire app

export interface AppState {
  lists: List[]
  draggedItem?: DragItem
}

// this describes the arguments passed to the dispatch/reducer function

interface AppStateContextProps {
  state: AppState
  dispatch: React.Dispatch<Action>
}

// this describes the type of the Action object that will be used to generate a new state

type Action =
  | {
    type: "ADD_LIST";
    payload: string
  }
  | {
    type: "ADD_TASK"
    payload: { text: string, listId: string }
  }
  | {
    type: "MOVE_LIST"
    payload: {
      dragIndex: number
      hoverIndex: number
    }
  }
  | {
    type: "SET_DRAGGED_ITEM"
    payload: DragItem | undefined
  }

// this is the initial state of the App

const appData: AppState = {
  lists: [
    {
      id: "0",
      text: "To Do",
      tasks: [{
        id: "c0",
        text: "Generate app scaffold"
      }]
    },
    {
      id: "1",
      text: "In Progress",
      tasks: [{
        id: "c2",
        text: "Learn Typescript"
      }]
    },
    {
      id: "2",
      text: "Done",
      tasks: [{
        id: "c3",
        text: "Begin to use static typing"
      }]
    },
  ]
}

const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "ADD_LIST": {
      return {
        ...state,
        lists: [
          ...state.lists,
          { id: nanoid(), text: action.payload, tasks: [] }
        ]
      }
    }
    case "ADD_TASK": {
      const targetListIndex = findItemIndexById(
        state.lists,
        action.payload.listId
      )

      const targetList = state.lists[targetListIndex];

      const updatedTargetList = {
        ...targetList,
        tasks: [
          ...targetList.tasks,
          { id: nanoid(), text: action.payload.text }
        ]
      }
      return {
        ...state,
        lists: overrideItemAtIndex(
          state.lists,
          updatedTargetList,
          targetListIndex
        )
      }
    }
    case "MOVE_LIST": {
      const { dragIndex, hoverIndex } = action.payload
      return {
        ...state,
        lists: moveItem(state.lists, dragIndex, hoverIndex)
      }
    }
    case "SET_DRAGGED_ITEM": {
      return {
        ...state,
        draggedItem: action.payload
      }
    }
    default: {
      return state
    }
  }
}

// This is a function that creates the initial app state 

const AppStateContext = createContext<AppStateContextProps>(
  {} as AppStateContextProps
);

export const AppStateProvider =
  ({ children }: React.PropsWithChildren<{}>) => {
    const [state, dispatch] = useReducer(appStateReducer, appData);
    return (
      <AppStateContext.Provider value={{ state, dispatch }}>
        {children}
      </AppStateContext.Provider>
    )
  };

  // exported method for 
  // const { state, dispatch } = useAppState();

export const useAppState = ():AppStateContextProps => {
  return useContext(AppStateContext);
} 