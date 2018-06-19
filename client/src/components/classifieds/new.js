import React, { Component } from 'react';
import { connect } from 'react-redux'
import CreateForm from './createForm';
import {createOffer, searchAddress} from '../../actions/index'
import GMap from '../g_map';
import SearchBar from '../search_bar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dropzone from 'react-dropzone';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import axios from 'axios';

class ClassifiedNew extends Component {
  constructor(props){
    super(props);
    this.state = {
      origin: {
        lng : 19.9449799,
        lat : 50.0646501
      },
      filesToBeSent: [],
      filesPreview: [],
      printCount: 4,
      address: {}
    };
  }

  submit = values => {
    const offer = {...values, ...this.state.address}
    console.log(values, offer);

    this.props.createOffer(offer,(id) => {
      this.handleUpload(this.state.filesToBeSent,id)
      this.props.history.push('/');
    })
  }

  onSearch = term => {
    this.props.searchAddress(term);
  }

  componentWillReceiveProps(nextProps) {
    const { searchedAddress } = nextProps;
    var address = {
      city: searchedAddress.locality,
      street: searchedAddress.route,
      district: searchedAddress.sublocality_level_1,
      buildingNum: searchedAddress.street_number,
      lat: searchedAddress.lat,
      lng: searchedAddress.lng
    }
    this.setState({address});
  }

  onDrop(acceptedFiles, rejectedFiles){
    var filesToBeSent = this.state.filesToBeSent;
    var filesPreview = this.state.filesPreview;

    if((filesToBeSent.length + acceptedFiles.length) <= this.state.printCount){
      filesToBeSent.push(...acceptedFiles);
      for(var i in acceptedFiles){
        filesPreview.push(<div key={acceptedFiles[i].name}>
          { acceptedFiles[i].name }
          <MuiThemeProvider>
            <a href="#">
              {/* <FontIcon
                className="material-icons customstyle"
                color={blue500}
                styles={{ top:10}}>
                clear
              </FontIcon> */}
            </a>
          </MuiThemeProvider>
        </div>);
      }
    }else{
      alert('Maksymalna liczba zdjęć to 4');
    }
    this.setState({filesToBeSent, filesPreview});
  }

  handleUpload = (files, offerId) =>{
    const userId = localStorage.getItem('id_token');

    const uploaders = files.map(file => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tags", offerId);
      formData.append("folder", 'mapa-stancji');
      formData.append("upload_preset", "qepxkhys");
      formData.append("api_key", "132379512591958");
      formData.append("timestamp", (Date.now() / 1000) | 0);

      return axios.post("https://api.cloudinary.com/v1_1/mkabionek/image/upload", formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      }).then(response => {
        const data = response.data;
        console.log(data);

        const fileURL = data.secure_url;
      }).catch(response => console.log(response));
    });

    axios.all(uploaders).then(() => {
      // console.log('Wysłano');
    });
  }

  render(){

    return(
      <div className="flex-container">
        <div className="row">
          <div className="col-md-50 Dodajta-form">
            <CreateForm onSubmit={this.submit} initialValues={this.state.address}>
              <Dropzone className="mojdrop"
                onDrop={files => this.onDrop(files)}>
                Kliknij, aby dodać zdjęcie.
              </Dropzone>
            </ CreateForm>
          </div>
          <div className="col-md-50 add-map">
            <SearchBar onSearch={this.onSearch} />
            <GMap origin={this.state.origin} />
            
          </div>
        </div>
        
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    searchedAddress: state.searchedAddress
  }
}

export default connect(mapStateToProps,{ createOffer, searchAddress })(ClassifiedNew);
