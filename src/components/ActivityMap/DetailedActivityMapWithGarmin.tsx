import { Typography } from '@mui/joy';
import { useState } from 'react';
import { Layer, LayerProps, Marker, Source } from 'react-map-gl';

import { DOG_COLOR } from '@/colors';
import { GarminActivity } from '@/models/garminActivity';
import { ActivityWithRecords, Coordinate } from '@/types';
import { lawOfCosinesDistance } from '@/utils/distanceUtils';
import { makeLineFromCoordinates } from '@/utils/mapboxUtils';

import { DetailedActivityMapBase } from './DetailedActivityMapBase';
import { LiveSeparation } from './LiveSeparation';
import { computeActivityDuration, findClosestCoord } from './utils';

type DetailedActivityMapProps = {
  activity: ActivityWithRecords;
  garminActivity: GarminActivity;
};

export function DetailedActivityMapWithGarmin({
  activity,
  garminActivity,
}: DetailedActivityMapProps) {
  const [humanCoord, setHumanCoord] = useState<Coordinate>(
    activity.records[0].coord
  );
  const [garminCoord, setGarminCoord] = useState<Coordinate>(
    garminActivity.records[0].coord
  );

  const garminGeoJSON = makeLineFromCoordinates(garminActivity.coordinates);

  const { activityDuration } = computeActivityDuration(
    activity,
    garminActivity
  );

  const garminRouteLayer: LayerProps = {
    id: 'garminRoute',
    type: 'line',
    source: 'garminRoute',
    paint: {
      'line-color': DOG_COLOR,
      'line-dasharray': [3.5, 2],
      'line-width': 4,
      'line-opacity': 0.75,
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  };

  const handleSliderChange = (newTargetTime: number): void => {
    // technically the slider could give us an array of values (but it never will in
    // this impl, so we just theoretically pull the first value

    setHumanCoord(findClosestCoord(activity.records, newTargetTime));
    if (garminActivity) {
      setGarminCoord(findClosestCoord(garminActivity.records, newTargetTime));
    }
  };

  const liveSeparation = lawOfCosinesDistance(humanCoord, garminCoord);

  return (
    <DetailedActivityMapBase
      activity={activity}
      activityDuration={activityDuration}
      onSliderChange={handleSliderChange}
      mapChildren={
        <>
          <Marker
            longitude={garminCoord[0]}
            latitude={garminCoord[1]}
            anchor="bottom"
            offset={[5, 0]}
          >
            <Typography level="h4">🐶</Typography>
          </Marker>
          <Source
            id="garminRoute"
            type="geojson"
            data={garminGeoJSON}
            lineMetrics
          >
            <Layer {...garminRouteLayer} />
          </Source>
        </>
      }
      sliderChildren={
        <>
          <LiveSeparation separation={liveSeparation} />
        </>
      }
    />
  );
  // return (
  //   <Stack sx={{ height: '100%' }}>
  //     <MapboxMap
  //       ref={mapRef}
  //       onLoad={handleMapLoad}
  //       initialViewState={{ bounds }}
  //     >
  //       <Source id="route" type="geojson" data={geoJSON} lineMetrics>
  //         <Layer {...routeLayer} />
  //       </Source>

  //       {humanCoord && (
  //         <Marker
  //           longitude={humanCoord[0]}
  //           latitude={humanCoord[1]}
  //           anchor="bottom"
  //           offset={[-5, 0]}
  //         >
  //           <Typography level="h4">🏃‍♂️</Typography>
  //         </Marker>
  //       )}

  //       {garminCoord && (
  //         <Marker
  //           longitude={garminCoord[0]}
  //           latitude={garminCoord[1]}
  //           anchor="bottom"
  //           offset={[5, 0]}
  //         >
  //           <Typography level="h4">🐶</Typography>
  //         </Marker>
  //       )}

  //       {garminGeoJSON && (
  //         <>

  //         </>
  //       )}
  //     </MapboxMap>
  //     <Box sx={{ mt: 2, mb: 2 }}>
  //       <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
  //         <MapSlider
  //           marks={sliderMarks}
  //           activityDuration={activityDuration}
  //           onChange={onSliderChange}
  //         />
  //       </Box>
  //       {garminActivity && <LiveSeparation separation={liveSeparation} />}
  //     </Box>
  //   </Stack>
  // );
}
