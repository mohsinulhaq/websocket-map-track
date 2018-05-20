/* global google */
import React from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps';
import socketioClient from 'socket.io-client';

const API_KEY = 'AIzaSyBXiSq92h8RuJMmWYQgxffuayD7lrONxbY';
const GOOGLE_MAP_URL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;

class Map extends React.Component {
  static displayName = 'GoogleMapContainer';

  state = {
    origin: null,
    directions: null,
    destination: null,
    waypoints: [],
  };

  componentDidMount() {
    const socket = socketioClient();
    this.directionsService = new google.maps.DirectionsService();

    socket.on('initialCoordinates', initialCoordinates => {
      this.setState({
        origin: initialCoordinates,
      });
    });

    socket.on('randomCoordinates', randomCoordinates => {
      this.setState(prevState => ({
        destination: randomCoordinates,
        waypoints: prevState.waypoints.concat(prevState.destination || []),
      }));
    });
  }

  componentDidUpdate() {
    let { origin, destination, waypoints } = this.state;

    // maximum waypoints allowed by google maps api is 23
    if (waypoints.length > 23) {
      this.setState(prevState => ({
        origin: prevState.waypoints[0],
        waypoints: prevState.waypoints.slice(1),
      }));
      return;
    }

    this.updateRoute(origin, destination, waypoints);
  }

  updateRoute(originCoordinates, destinationCoordinates, waypointCoordinates) {
    const origin = new google.maps.LatLng(originCoordinates.lat, originCoordinates.lng);

    const destination = destinationCoordinates
      ? new google.maps.LatLng(destinationCoordinates.lat, destinationCoordinates.lng)
      : origin;

    const travelMode = google.maps.TravelMode.WALKING;

    const waypoints = waypointCoordinates.map(coord => ({
      location: new google.maps.LatLng(coord.lat, coord.lng),
      stopover: true,
    }));

    this.directionsService.route({
        origin,
        destination,
        travelMode,
        waypoints,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        }
      },
    );
  }

  render() {
    return <GoogleMap>{this.state.directions && <DirectionsRenderer directions={this.state.directions} />}</GoogleMap>;
  }
}

export default compose(
  withProps({
    googleMapURL: GOOGLE_MAP_URL,
    loadingElement: <div style={{ height: '100vh' }} />,
    containerElement: <div style={{ height: '100vh' }} />,
    mapElement: <div style={{ height: '100vh' }} />,
  }),
  withScriptjs,
  withGoogleMap,
)(Map);