import createApp from '../src/app'

import i18n from '../src/plugins/i18n-plugin'

import { takeEvery, takeLatest, delay } from 'redux-saga'
import { take, put, call, fork, select, race } from 'redux-saga/effects'

describe('create app', () => {

  it('can be created', () => {

    const app = createApp({});

    expect(app).not.toBeNull();

    // app.model({
    //   name: 'userList',
    //   initialState: {
    //     isFetching: false
    //   },
    //   reducers: {
    //     test: function(state, action) {
    //       return state;
    //     }
    //   },
    //   sagas: {
    //
    //     *list(action) {
    //
    //       yield update({isFetching: true})
    //
    //       const { response, error} = yield call(fetch, `http://www.baidu.com`)
    //
    //       if (response) {
    //
    //         yield update({isFetching: false, items: response})
    //       } else {
    //
    //         yield update({isFetching: true, error})
    //       }
    //     }
    //   }
    // })
    //
    app.render();
  })

  it('', () => {

  })
})
