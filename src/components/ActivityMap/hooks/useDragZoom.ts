import { useState } from 'react';
import { AreaChart } from 'recharts';

type UseDragZoomArgs<T> = {
  max: number;
  data: T[];
  xAxisKey: keyof T;
  dataKeys: Array<keyof T>;
};

type UseDragZoom<T> = {
  top: number;
  bottom: number;
  left: string;
  right: string;
  refLeft: string;
  refRight: string;
  onMouseDown: React.ComponentProps<typeof AreaChart>['onMouseDown'];
  onMouseUp: React.ComponentProps<typeof AreaChart>['onMouseUp'];
  onMouseMove: React.ComponentProps<typeof AreaChart>['onMouseMove'];
  onMouseLeave: React.ComponentProps<typeof AreaChart>['onMouseLeave'];
  isZoomed: boolean;
  dataSlice: T[];
  resetZoom: () => void;
};

/**
 * Hook for dragging and zooming into a recharts map, based on
 * https://recharts.org/en-US/examples/HighlightAndZoomLineChart
 * and https://github.com/aradmargalit/phobos/blob/main/deimos/src/components/IntervalGraph/IntervalGraph.jsx#L16
 */
export function useDragZoom<T>({
  max,
  data,
  xAxisKey,
  dataKeys,
}: UseDragZoomArgs<T>): UseDragZoom<T> {
  // 'dataMin' and 'dataMax' let recharts default to the left and right bounds of the data
  const initialState = {
    bottom: 0,
    dataSlice: data,
    left: 'dataMin',
    refLeft: '',
    refRight: '',
    right: 'dataMax',
    top: max,
  };

  const [state, setState] = useState(initialState);

  // Helper to determine if we are zoomedIn
  const isZoomed = state.left !== initialState.left;

  /**
   * Set the new bottom and top for the selected slice of data
   */
  function getAxisYDomain(
    data: T[],
    dataKeys: Array<keyof T>,
    xAxisKey: keyof T,
    leftBound: string,
    rightBound: string
  ) {
    // Data is already sorted, so push everything from left to right into an array
    // Once we find the data point at the left bound, set hitLeft to true
    // Once we reach the data point at the right bound, set hitRight to true
    const newSlice: T[] = [];
    let hitLeft = false;
    let hitRight = false;

    // For each data point, either skip or push it to newSlice, depending on if it's "in bounds"
    data.forEach((point) => {
      // If I'm done, because I already found the right bound, return early
      if (hitRight) return;

      const xAxisValue = point[xAxisKey];

      // If we aren't yet at the left bound, continue until we do.
      if (!hitLeft) {
        if (xAxisValue !== leftBound) return;
        // If we haven't returned, we've hitleft!
        hitLeft = true;
      }

      // If we didn't return earlier, we're neither before left bound nor ahead of right bound
      // which means it's safe to push in
      newSlice.push(point);

      // Lastly, if this is the last point, cancel the for loop by setting hitRight to true
      if (xAxisValue === rightBound) {
        hitRight = true;
      }
    });

    // new top is whatever is highest across all data sets
    const newTop = Math.max(
      ...newSlice
        .map((point) => {
          let pointMax = point[dataKeys[0]] as number;
          for (const k of dataKeys) {
            const yVal = point[k];
            if (yVal !== null && (yVal as number) > pointMax) {
              pointMax = yVal as number;
            }
          }
          return pointMax;
        })
        .filter((x) => x != null)
    );

    // new bottom is whatever is lowest across all data sets
    const newBottom = Math.min(
      ...newSlice
        .map((point) => {
          let pointMin = point[dataKeys[0]] as number;
          for (const k of dataKeys) {
            const yVal = point[k];
            if (yVal !== null && (yVal as number) < pointMin) {
              pointMin = yVal as number;
            }
          }
          return pointMin;
        })
        .filter((x) => x != null)
    );

    return { newBottom, newSlice, newTop };
  }

  function zoomIn() {
    const { refLeft, refRight } = state;
    let newLeft = refLeft;
    let newRight = refRight;

    // If the bounds are the same, or there's no right bound yet, return and clear refs
    if (refLeft === refRight || refRight === '' || !refRight) {
      setState({ ...state, refLeft: '', refRight: '' });
      return;
    }

    // If they drag right-to-left, swap them so it's as if they dragged left to right
    const leftIndex = data.findIndex((x) => x[xAxisKey] === refLeft);
    const rightIndex = data.findIndex((x) => x[xAxisKey] === refRight);
    if (rightIndex < leftIndex) {
      [newLeft, newRight] = [refRight, refLeft];
    }

    // yAxis domain
    const { newBottom, newTop, newSlice } = getAxisYDomain(
      data,
      dataKeys,
      xAxisKey,
      newLeft,
      newRight
    );

    setState({
      bottom: newBottom,
      dataSlice: newSlice,
      left: newLeft,
      refLeft: '',
      refRight: '',
      right: newRight,
      top: newTop,
    });
  }

  const onMouseDown: React.ComponentProps<typeof AreaChart>['onMouseDown'] = (
    e
  ) => e && setState({ ...state, refLeft: e.activeLabel ?? '' });

  const onMouseMove: React.ComponentProps<typeof AreaChart>['onMouseDown'] = (
    e
  ) =>
    e && state.refLeft && setState({ ...state, refRight: e.activeLabel ?? '' });

  const onMouseLeave = () => setState({ ...state, refLeft: '', refRight: '' });
  const onMouseUp = zoomIn;

  function resetZoom() {
    setState(initialState);
  }

  return {
    bottom: state.bottom,
    dataSlice: state.dataSlice,
    isZoomed,
    left: state.left,
    onMouseDown,
    onMouseLeave,
    onMouseMove,
    onMouseUp,
    refLeft: state.refLeft,
    refRight: state.refRight,
    resetZoom,
    right: state.right,
    top: state.top,
  };
}
