/*
 *
 * ImageSelector reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  IMAGE_UPLOAD_REQUESTED,
  IMAGE_UPLOAD_FAILED,
  IMAGE_UPLOAD_COMPLETE,
  UPLOADER_STATUS,
} from './constants';

const initialState = fromJS({
  status: UPLOADER_STATUS.IDLE,
});

function imageSelectorReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case IMAGE_UPLOAD_REQUESTED:
      console.error('reducer got: IMAGE_UPLOAD_REQUESTED', action);
      return state.updateIn(['status'], () => UPLOADER_STATUS.UPLOADING);
    case IMAGE_UPLOAD_FAILED:
      console.error('reducer got: IMAGE_UPLOAD_FAILED', action);
      return state.updateIn(['status'], () => UPLOADER_STATUS.FAILED);
    case IMAGE_UPLOAD_COMPLETE:
      console.error('reducer got: IMAGE_UPLOAD_COMPLETE', action);
      return state.updateIn(['status'], () => UPLOADER_STATUS.COMPLETE);
    default:
      return state;
  }
}

export default imageSelectorReducer;