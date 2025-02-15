import * as React from 'react';
import {
  useGridPageSize,
  defaultPageSize,
  throwIfPageSizeExceedsTheLimit,
} from './useGridPageSize';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridPage, getPageCount } from './useGridPage';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

export const paginationStateInitializer: GridStateInitializer<
  Pick<
    DataGridProcessedProps,
    'page' | 'pageSize' | 'rowCount' | 'initialState' | 'autoPageSize' | 'signature'
  >
> = (state, props) => {
  let pageSize: number;
  if (props.pageSize != null) {
    pageSize = props.pageSize;
  } else if (props.initialState?.pagination?.pageSize != null) {
    pageSize = props.initialState.pagination.pageSize;
    throwIfPageSizeExceedsTheLimit(pageSize, props.signature);
  } else {
    pageSize = defaultPageSize(props.autoPageSize);
  }

  return {
    ...state,
    pagination: {
      pageSize,
      page: props.page ?? props.initialState?.pagination?.page ?? 0,
      pageCount: getPageCount(props.rowCount ?? 0, pageSize),
      rowCount: props.rowCount ?? 0,
    },
  };
};

/**
 * @requires useGridFilter (state)
 * @requires useGridDimensions (event) - can be after
 */
export const useGridPagination = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'page'
    | 'pageSize'
    | 'onPageChange'
    | 'onPageSizeChange'
    | 'autoPageSize'
    | 'rowCount'
    | 'initialState'
    | 'paginationMode'
    | 'rowHeight'
  >,
) => {
  useGridPageSize(apiRef, props);
  useGridPage(apiRef, props);
};
