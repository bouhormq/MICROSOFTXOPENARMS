import React, { memo, useMemo, useState, useEffect} from 'react';
import {
  AzureMap,
  AzureMapDataSourceProvider,
  AzureMapFeature,
  AzureMapHtmlMarker,
  AzureMapLayerProvider,
  AzureMapsProvider,
  IAzureDataSourceChildren,
  IAzureMapFeature,
  IAzureMapHtmlMarkerEvent,
  IAzureMapLayerType,
  IAzureMapOptions,
} from 'react-azure-maps';
import { AuthenticationType, data, HtmlMarkerOptions, SymbolLayerOptions } from 'azure-maps-control';
import { Button, Chip} from '@material-ui/core';
import { key } from './key';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logo from './rrss.png'
import Axios from "axios";



const point4 = new data.Position(10.28759658, 38.12764268);

function clusterClicked(e: any) {
  console.log('clusterClicked', e);
}

const onClick = (e: any) => {
  console.log('You click on: ', e);
};

function azureHtmlMapMarkerOptions(coordinates: data.Position): HtmlMarkerOptions {
  return {
    position: coordinates,
    text: 'My text',
    title: 'Title',
  };
}

const memoizedOptions: SymbolLayerOptions = {
  
  textOptions: {
    textField: ['get', 'title'], //Specify the property name that contains the text you want to appear with the symbol.
    offset: [0, 1.2],
  },
  iconOptions: {
    image: "pin-round-red"
  },
};

const eventToMarker: Array<IAzureMapHtmlMarkerEvent> = [{ eventName: 'click', callback: onClick }];

const renderPoint = (coordinates: data.Position): IAzureMapFeature  => {
  const rendId = Math.random();

  return (
    <AzureMapFeature
      key={rendId}
      id={rendId.toString()}
      type="Point"
      coordinate={coordinates}
    />
  );
};

function renderHTMLPoint(coordinates: data.Position): any {
  const rendId = Math.random();
  return (
    <AzureMapHtmlMarker
      key={rendId}
      markerContent={<div className="pulseIcon"></div>}
      options={{ ...azureHtmlMapMarkerOptions(coordinates) } as any}
      events={eventToMarker}
    />
  );
}

const colorValue = () =>
  '#000000'.replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
  });
const markersStandardImages = [
  `pin-round-darkblue`,
];

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 1),
  },
}));

const rand = () => ( markersStandardImages[Math.floor(Math.random() * markersStandardImages.length)] )
const MarkersExample: React.FC = () => {
  const [markers, setMarkers] = useState([] as any);
  const [htmlMarkers, setHtmlMarkers] = useState([point4]);
  const [show, setshow] = useState(false);
  const [latitude, setlatitude] = useState('');
  const [longitude, setlongitude] = useState('0');
  const [markersLayer] = useState<IAzureMapLayerType>('SymbolLayer');
  const [layerOptions, setLayerOptions] = useState<SymbolLayerOptions>(memoizedOptions);

  const option: IAzureMapOptions = useMemo(() => {
    return {
      authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: key,
      },
      center: [1.482148, 39.020012],
      zoom: 5,
      view: 'Auto',
    };
  }, []);

  const addRandomMarker = (event) => {
    event.preventDefault()
    const newPoint = new data.Position(parseFloat(longitude), parseFloat(latitude));
    console.log(JSON.stringify(newPoint));
    setMarkers([...markers, newPoint]);
    setshow(false)
    Axios.post("https://microsoftxopenarms.herokuapp.com/create", {
      longitude: longitude,
      latitude: latitude,
    }).then(() => {
      console.log("sucess")
    });
  };

  const addRandomHTMLMarker = () => {
    const newPoint = new data.Position(parseFloat(longitude), parseFloat(latitude));
    setHtmlMarkers([...htmlMarkers, newPoint]);
  };
  const blabla = () => {
    setshow(true);
    setlongitude("")
    setlatitude("")
  };

  const removeAllMarkers = () => {
    setMarkers([]);
    setHtmlMarkers([]);
    Axios.delete("https://microsoftxopenarms.herokuapp.com/delete").then(() => {
      console.log("Everything was deleted")
    })
  };

    useEffect(() => {
      // Your code here
      Axios.get("https://microsoftxopenarms.herokuapp.com/coordenadas").then((response) => {
      console.log(JSON.stringify(response.data));
      var i
      var aux = [] as any;
      console.log("NUMBER OF INCIDENTS IN DB " + JSON.stringify(response.data.length))
      for (i = 0; i < response.data.length; i++) {  
      var newPoint = new data.Position(parseFloat(response.data[i].longitude), parseFloat(response.data[i].latitude));
      console.log(JSON.stringify(newPoint));
      aux.push(newPoint);
      console.log(JSON.stringify(aux));
      }
      setMarkers(markers => ([...markers, ...aux]));
      console.log(JSON.stringify(markers))})
    }, []);

  const memoizedMarkerRender: IAzureDataSourceChildren = useMemo(
    (): any => markers.map((marker) => renderPoint(marker)),
    [markers],
  );



  const memoizedHtmlMarkerRender: IAzureDataSourceChildren = useMemo(
    (): any => htmlMarkers.map((marker) => renderHTMLPoint(marker)),
    [htmlMarkers],
  );

  console.log('MarkerExample RENDER');
  
  const classes = useStyles();

  return (
    <>
      {show ? <Container component="main" maxWidth="xs">
      <img src={logo} alt="Logo" style={{height: "100px"}}/>
      <CssBaseline />
      <div className={classes.paper} style={{margin: "0px"}}>
        <form className={classes.form} noValidate onSubmit={(event) => addRandomMarker(event)}>
          <TextField value={longitude} onChange ={(e) => setlongitude(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Longitud"
            id="longitud"
            autoFocus
            type="text"
          />
          <TextField value={latitude} onChange ={(e) => setlatitude(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="latitude"
            type="text"
            label="Latitude"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Add
          </Button>
        </form>
      </div>
      <Box mt={8}>
      </Box>
    </Container> : null}
      <div id = "someRandomID" style={styles.buttonContainer}>
        <Button size="small" variant="contained" color="primary" onClick={blabla}>
          {' '}
          REPORT VESSEL INCIDENT
        </Button>
        <Button size="small" variant="contained" color="primary" onClick={removeAllMarkers}>
          {' '}
          REMOVE ALL
        </Button>
        <Chip label={`NUMBER OF INCIDENTS REPORTED: ${markers.length}`} />

      </div>
      <AzureMapsProvider>
        <div style={styles.map} onClick={() => setshow(false)}>
          <AzureMap options={option}>
            <AzureMapDataSourceProvider
              events={{
                dataadded: (e: any) => {
                  console.log('Data on source added', e);
                },
              }}
              id={'markersExample AzureMapDataSourceProvider'}
              options={{ cluster: true, clusterRadius: 2}}
            >
              <AzureMapLayerProvider
                id={'markersExample AzureMapLayerProvider'}
                options={layerOptions}
                events={{
                  click: clusterClicked,
                  dbclick: clusterClicked,
                }}
                lifecycleEvents={{
                  layeradded: () => {
                    console.log('LAYER ADDED TO MAP');
                  },
                }}
                type={markersLayer}
              />
              {memoizedMarkerRender}
              {memoizedHtmlMarkerRender}
            </AzureMapDataSourceProvider>
          </AzureMap>
        </div>
      </AzureMapsProvider>
    </>
  );
};

const styles = {
  map: {
    height: '100vh', width: '100vw'
  },
  buttonContainer: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: '10px',
    gridAutoColumns: 'max-content',
    padding: '10px',
    alignItems: 'center',
  },
  button: {
    height: 35,
    width: 80,
    backgroundColor: '#68aba3',
    'text-align': 'center',
  },
};
export default memo(MarkersExample);