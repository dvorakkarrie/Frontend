import React from "react";
import { Route, Link, Switch, Redirect, withRouter } from "react-router-dom";
import axios from "axios";

import "./App.css";
import Events from "./components/Events";
import EventDetail from "./components/EventDetail";
import CreateEvent from "./components/CreateEvent";
import CreateItem from "./components/CreateItem";
import UpdateItem from "./components/UpdateItem";

// const backendUrl = "http://localhost:8080/"
let backendUrl = process.env.REACT_APP_BACKEND_APP_URL || "http://localhost:8080/";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //events is array of events found in api get events call
      // events: [],
      events: [],
      //create event form variables
      eventSeller: "",
      eventName: "",
      eventDate: "",
      eventLocation: "",
      //create item form variables
      itemName: "",
      itemDescription: "",
      itemCost: "",
      itemSold: "",
      //update item form variables
      itemUpdateName: "",
      itemUpdateDescription: "",
      itemUpdateCost: "",
      itemUpdateSold: ""
    };
  }

  componentDidMount() {
    this.getEventsAxios();
  }

  getEventsAxios() {
    axios({ method: "GET", url: backendUrl }).then(eventData =>
      this.setState({ events: eventData.data })
    );
  }

  createEventAxios() {
    // console.log(this.state);
    // console.log(`${backendUrl}new-event`);
    axios({
      method: "POST",
      url: `${backendUrl}new-event`,
      data: {
        seller: {
          name: this.state.eventSeller
        },
        events: {
          eDescription: this.state.eventName,
          //    date: this.state.eventDate,
          location: this.state.eventLocation,
          items: []
        }
      }
    }).then(newEvent => {
      this.props.history.push(`/event/${newEvent.data._id}`);
      this.setState(prevState => ({
        events: [...prevState.events, newEvent.data]
      }));
    });
  }

  createItemAxios() {
    let eventId = this.props.location.pathname.slice(10);
    axios({
      method: "PUT",
      url: `${backendUrl}new-item`,
      data: {
        event: {
          _id: eventId
        },
        item: {
          item: this.state.itemName,
          iDescription: this.state.itemDescription,
          cost: this.state.itemCost,
          image: this.state.itemUrl,
          sold: "false"
        }
      }
    }).then(newItem => {
      this.getEventsAxios();
      this.props.history.push(`/event/${eventId}`);
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.createEventAxios();
  };

  handleItemSubmit = event => {
    event.preventDefault();
    this.createItemAxios();
  };

  handleChange = event => {
    // console.log(event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  deleteAxiosEvent = event => {
    console.log(`${backendUrl}event/${event.target.id}`)
    event.preventDefault();
    axios({
      method: "DELETE",
      url: `${backendUrl}event/${event.target.id}`
    }).then(deletedEvent => {
      this.getEventsAxios();
    });
  };

  //this updates the sold value on an item (clicking on green $ button on event detail page)
  itemSold = event => {
    let newSoldValue = event.target.getAttribute('soldValue')
    event.preventDefault();
    axios({
      method: "PUT",
      url: `${backendUrl}update-item/${event.target.id}`,
      data: {
          sold: newSoldValue
        }
    }).then(updateItem => {
      this.getEventsAxios();
    });
  };

  // If we can get props to pass from the UpdateItem component... we know this axios update item function WILL WORK... 
  handleItemUpdate = event => {
    console.log(this.state.itemUpdateName);
    console.log(`${backendUrl}update-item/${event.target.id}`)
    event.preventDefault();
    axios({
      method: "PUT",
      url: `${backendUrl}update-item/${event.target.id}`,
      data: {
          item: this.state.itemUpdateName,
          iDescription: this.state.itemUpdateDescription,
          cost: this.state.itemUpdateCost,
          image: this.state.itemUpdateUrl
        }
    }).then(updateItem => {
      this.getEventsAxios();
    });
  };

  deleteAxiosItem = event => {
    event.preventDefault();
    axios({
      method: "DELETE",
      url: `${backendUrl}delete-item/${event.target.id}`
    }).then(deletedItem => {
      this.getEventsAxios();
    });
  };

  render() {
    return (
      <div className='App'>
        <Link to='/' className='home'>
          <div className='title'>
            <p className='e'>e</p>
            <p className='s'>s</p>
            <p className='a'>a</p>
            <p className='l'>l</p>
            <p className='e2'>e</p>
          </div>
          <span role='img' className='logo' aria-label='logo'>
            🛒
          </span>
        </Link>

        {/* create an Event (row component) for each event in dataset */}
        <Switch>
          <Route
            exact
            path='/'
            render={routerProps => (
              <Events
                events={this.state.events}
                handleDelete={this.deleteAxiosEvent}
              />
            )}
          />

          {/* Route to view EventDetail component */}
          <Route
            path='/event/:id'
            render={routerProps => (
              <EventDetail
                {...routerProps}
                events={this.state.events}
                newItem={this.state.newItem}
                handleItemDelete={this.deleteAxiosItem}
                itemSold={this.itemSold}
              />
            )}
          />

          {/* Route to create a new event (from Home) */}
          <Route
            path='/new-event'
            render={() => (
              <CreateEvent
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
              />
            )}
          />

          {/* Route to create a new event item (on EventDetails component)*/}
          <Route
            path='/new-item'
            render={routerProps => (
              <CreateItem
                {...routerProps}
                handleChange={this.handleChange}
                handleItemSubmit={this.handleItemSubmit}
                id={routerProps.location.pathname}
              />
            )}
          />

           {/* Route to update item (on EventDetails component)*/}
           <Route
            path='/update-item/:eventId/:itemId'
            render={routerProps => (
              <UpdateItem
                {...routerProps}
                handleChange={this.handleChange}
                handleItemUpdate={this.handleItemUpdate}
                allEvents={this.state.events}
                updateItem={this.state}
                id={routerProps.location.pathname}
              />
            )}
          />
          <Route path='/*' render={() => <Redirect to='/event/' />} />
        </Switch>
      </div>
    );
  }
}
//need to wrap with Router... mern-lab...
export default withRouter(App);
