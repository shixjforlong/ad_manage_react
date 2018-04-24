import { getPhoneAdsList,addPhoneAd,updatePhoneAd,removePhoneAd,} from '../services/phoneAd';

export default {
	namespace: 'phoneAd',

    state: {
	    data: {
	      list: [],
	      pagination: {},
	    },
	    add: {
          status: 'ok',
        },
    },

    effects: {
         *getPhoneAds({ payload }, { call, put }) {
		      const response = yield call(getPhoneAdsList, payload);
		      yield put({
		        type: 'save',
		        payload: response,
		      });
         },
				 *add({ payload }, { call, put }) {
					 console.log("111111");
		      const { onSuccess } = payload;
		      const response = yield call(addPhoneAd, payload);
		      const { error } = response;

		      if (error) {
		        yield put({
		          type: 'save',
		          payload: {
		            status: 'error',
		            error: response,
		          },
		        });
		      } else {
		        yield put({
		          type: 'save',
		          payload: {
		            status: 'ok',
		          },
		        });
		        onSuccess();
		      }
         },
				 *upates({ payload, callBack }, { call, put }) {
					const response = yield call(updatePhoneAd, payload);
					const { error } = response;
					const { result } = response;
					const { onSuccess } = payload;
					if (result) {
						yield put({
						 type: 'save',
						 payload: {
								status: 'ok',
						 },
					 });
					 onSuccess();
					} else {
						yield put({
							 type: 'save',
							 payload: {
								 status: 'error',
								 error: response,
							 },
						 });
					}
				},
				*remove({ payload }, { call, put }) {
				 const { onSuccess } = payload;
				 const response  = yield call(removePhoneAd, payload);
				 if (response) {
					 yield put({
							type: 'save',
							payload: {
								status: 'ok',
							},
						});
						onSuccess();
				}
				 },


    },
    reducers: {
	    save(state, { payload }) {
	      return {
	        ...state,
	        data: {
	          list: payload.result,
	          pagination: {
	            total: payload.total,
	            pageSize: payload.limit,
	            current: payload.cursor / payload.limit + 1,
	          },
	        },
	      };
	    },
  },

};
