/* global google */
import React from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps';
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';
import socketioClient from 'socket.io-client';

const API_KEY = 'AIzaSyBXiSq92h8RuJMmWYQgxffuayD7lrONxbY';
const GOOGLE_MAP_URL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;

function getGoogleCoordinates(coordinates = {}) {
  const defaultCoordinates = {
    lat: 34.068998,
    lng: 74.8078893,
  };
  return new google.maps.LatLng(
    coordinates.lat || defaultCoordinates.lat,
    coordinates.lng || defaultCoordinates.lng,
  );
}

class Map extends React.Component {
  static displayName = 'GoogleMapContainer';

  componentDidMount() {
    const { user : { id }, updateUser } = this.props;
    const socket = this.socket = socketioClient();
    this.directionsService = new google.maps.DirectionsService();

    socket.on('initialCoordinates', (initialCoordinates, callback) => {
      updateUser(id, { origin: initialCoordinates });
      callback();
    });

    socket.on('randomCoordinates', randomCoordinates => {
      const { user : { destination, waypoints } } = this.props;
      updateUser(id, {
        destination: randomCoordinates,
        waypoints: waypoints.concat(destination || []),
      });
    });

    socket.on('status', status => {
      updateUser(id, { offline: status === 'offline' });
    });
  }

  componentDidUpdate() {
    const { user, updateUser } = this.props;
    let { origin, destination, waypoints } = user;

    // maximum waypoints allowed by google maps api is 23
    if (waypoints.length > 23) {
      updateUser(user.id, {
        origin: waypoints[0],
        waypoints: waypoints.slice(1),
      });
      return;
    }

    this.updateRoute(origin, destination, waypoints);
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  updateRoute(originCoordinates, destinationCoordinates, waypointCoordinates) {
    const { user, updateUser } = this.props;
    const origin = getGoogleCoordinates(originCoordinates);

    const destination = destinationCoordinates
      ? getGoogleCoordinates(destinationCoordinates)
      : origin;

    const travelMode = google.maps.TravelMode.WALKING;

    const waypoints = waypointCoordinates.map(coord => ({
      location: getGoogleCoordinates(coord),
      stopover: true,
    }));

    this.directionsService.route(
      {
        origin,
        destination,
        travelMode,
        waypoints,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          updateUser(user.id, { directions: result });
        }
      },
    );
  }

  render() {
    const { directions, destination, offline } = this.props.user;

    return (
      <GoogleMap>
        {directions && <DirectionsRenderer directions={directions} />}
        {offline &&
          destination && (
            <InfoBox defaultPosition={getGoogleCoordinates(destination)}>
              <div style={{ backgroundColor: `cyan`, opacity: 0.75, padding: `12px` }}>
                <div style={{ fontSize: `16px`, fontColor: `#08233B` }}>The user is now offline.</div>
              </div>
            </InfoBox>
          )}
      </GoogleMap>
    );
  }
}

export default compose(
  withProps({
    googleMapURL: GOOGLE_MAP_URL,
    loadingElement: <div />,
    containerElement: <div style={{ width: '100%' }} />,
    mapElement: <div style={{ height: '100vh' }} />,
  }),
  withScriptjs,
  withGoogleMap,
)(Map);
