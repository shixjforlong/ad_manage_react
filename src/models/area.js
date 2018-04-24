import { getAreasList,addArea,updateArea,removeArea,} from '../services/area';

export default {
	namespace: 'area',

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
         *getAreas({ payload }, { call, put }) {
		      const response = yield call(getAreasList, payload);
		      yield put({
		        type: 'save',
		        payload: response,
		      });
         },
         *add({ payload }, { call, put }) {
		      const { onSuccess } = payload;
		      const response = yield call(addArea, payload);
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
		       const response = yield call(updateArea, payload);
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
		      const response  = yield call(removeArea, payload);
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
