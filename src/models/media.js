import { getMediasList,getOSSTokenInfo,getOSSObjectInfo,addMedia,removeMedia,updateMedia,} from '../services/media';

export default {
	namespace: 'media',

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
         *getMedias({ payload }, { call, put }) {
		      const response = yield call(getMediasList, payload);
		      yield put({
		        type: 'save',
		        payload: response,
		      });
         },

				 *getOSSToken({payload }, { call, put }) {
					 const { onSuccess } = payload;
		       const { result } = yield call(getOSSTokenInfo, payload);
		       if (result) {
		         yield put({
		           type: 'save',
		           payload: result,
		         });
						 sessionStorage.setItem('accessKey', result.accessKey);
						 sessionStorage.setItem('accessid', result.accessid);
						 sessionStorage.setItem('bucket', result.bucket);
						 sessionStorage.setItem('endpoint', result.endpoint);
						 sessionStorage.setItem('signature', result.signature);
		       }
		     },

				 *getObjectInfo({payload }, { call, put }) {
					 const { onSuccess } = payload;
		       const { result } = yield call(getOSSObjectInfo, payload);
		       if (result) {
		         yield put({
		           type: 'save',
		           payload: result,
		         });
						 onSuccess(result);
		       }
		     },
				 *add({ payload }, { call, put }) {
		      const { onSuccess } = payload;
		      const response = yield call(addMedia, payload);
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
		       const response = yield call(updateMedia, payload);
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
		      const response  = yield call(removeMedia, payload);
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
