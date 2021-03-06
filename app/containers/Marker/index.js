/**
*
* Marker
*
*/

import React from 'react';
import { connect } from 'react-redux';
import RecordButton from 'RecordButton';
import PlayButton from 'PlayButton';
import MarkerDeleteCountdown from 'MarkerDeleteCountdown';
import {
  requestAudioRecording,
  stopAudioRecording,
  playSound,
  pauseSound,
  initMarkerDeletion,
  cancelMarkerDeletion,
} from 'MarkerOverlay/actions';
import { MARKER_STATE } from 'MarkerOverlay/constants';
import { createSelector } from 'reselect';
import projectSelector from 'projectSelector';

class Marker extends React.Component {
  onRecord = () => {
    this.props.record(this.props.marker.toJSON(),
      this.props.maxRecordingTime);
  };

  onStopRecording = () => {
    this.props.stopRecording(this.props.marker.toJSON());
  };

  onPlay = () => {
    this.props.play(this.props.marker.toJSON());
  };

  onPause = () => {
    this.props.pause(this.props.marker.toJSON());
  };

  getMarkerButton = () => {
    if (this.props.marker.get('sound')) {
      return <PlayButton sound={this.props.marker.get('sound')} onPlay={this.onPlay} onPause={this.onPause} />;
    }

    const markerState = this.props.marker.get('state');
    const isRecording = markerState === MARKER_STATE.RECORDING;
    return <RecordButton recording={isRecording} onRecord={this.onRecord} onStopRecording={this.onStopRecording} />;
  };

  generateClassName = () => {
    const base = 'marker';

    if (this.props.marker.get('state') === MARKER_STATE.RECORDING) {
      return `${base} recording`;
    }

    if (this.props.marker.get('state') === MARKER_STATE.UPLOADING) {
      return `${base} uploading`;
    }

    if (this.props.marker.get('state') === MARKER_STATE.PLAYING) {
      return `${base} playing`;
    }

    if (this.props.marker.get('state') === MARKER_STATE.DELETING) {
      return `${base} normal deleting`;
    }

    if (this.props.marker.get('state') === MARKER_STATE.DELETION_CONFIRMED) {
      return `${base} poof`;
    }

    if (this.props.marker.get('sound')) {
      return `${base} normal`;
    }

    return `${base} ready-to-record`;
  };

  render() {
    const marker = this.props.marker;
    const markerWidth = 48;
    const markerHeight = 50;
    const x = Math.floor(100 * marker.get('x'));
    const y = Math.floor(100 * marker.get('y'));
    const styles = {
      left: `${x}%`,
      top: `${y}%`,
      marginLeft: -markerWidth / 2,
      marginTop: -markerHeight / 2,
      width: markerWidth,
      height: markerHeight,
    };
    const divProps = {
      className: this.generateClassName(),
      style: styles,
      onMouseDown: (e) => {
        // if this is not a left click, exit
        if (e.button !== 0) {
          return;
        }

        if (this.props.readOnly) {
          return;
        }

        if (this.props.marker.get('state') === MARKER_STATE.NORMAL) {
          this.deletionTimerId = setTimeout(() => {
            this.props.initMarkerDeletion(this.props.marker.toJSON());
          }, 1000);
        }
      },

      onMouseUp: () => {
        if (this.deletionTimerId) {
          clearTimeout(this.deletionTimerId);
        }

        if (this.props.marker.get('state') === MARKER_STATE.DELETING) {
          this.props.cancelMarkerDeletion(this.props.marker.toJSON());
        }
      },
    };

    return (
      <div { ...divProps }>
        {this.getMarkerButton()}
        {this.props.marker.get('state') === MARKER_STATE.DELETING ? <MarkerDeleteCountdown /> : null}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    record: (marker, maxRecordingTime) => dispatch(requestAudioRecording(marker, maxRecordingTime)),
    stopRecording: (marker) => dispatch(stopAudioRecording(marker)),
    play: (marker) => dispatch(playSound(marker)),
    pause: (marker) => dispatch(pauseSound(marker)),
    initMarkerDeletion: (marker) => dispatch(initMarkerDeletion(marker)),
    cancelMarkerDeletion: (marker) => dispatch(cancelMarkerDeletion(marker)),
  };
}

function selectProjectAttributes(project) {
  return {
    maxRecordingTime: project.get('maxRecordingTime'),
  };
}

export default connect(
  createSelector(projectSelector, selectProjectAttributes),
  mapDispatchToProps
)(Marker);
