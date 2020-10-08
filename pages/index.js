import Head from 'next/head';
import { useState, useEffect } from "react";
import { API_URL } from 'services/constants';
import AsyncSelect from 'react-select/async';
import Axios from 'axios';
const Home = () => {
  const [place, setPlace] = useState();
  const [showPlace, setShowPlace] = useState({label: "Bang Sue", value: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const defName = 'Bang Sue';
    async function defaultPlace() {
      setIsLoading(true)
      await Axios.get(API_URL + 'place-autocomplete?q=' + defName)
        .then(function (res) {
          if (res.status === 200) {
            const rawData = res.data.predictions.map((i) => ({ label: i.description, value: i.place_id }));
            setOptions(rawData);
            // console.log(rawData[0].label);
            defaultData(rawData[0].value);
            return rawData;
          }
          // console.log(res);
        })
        .catch(function (error) {
          console.log(error);
        })
      setIsLoading(false)
    }
    async function defaultData(value) {
      setIsLoading(true)
      await Axios.get(API_URL + 'get-data?q=' + value)
        .then(function (res) {
          if (res.status === 200) {
            setItems(res.data.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        })
        setIsLoading(false)
    }
    defaultPlace();
  }, []);
  const getData = async (placeName) => {
    const res = await Axios.get(API_URL + 'place-autocomplete?q=' + placeName)
    if (res.data.status === 200) {
      const rawData = res.data.data.predictions.map((i) => ({ label: i.description, value: i.place_id }));
      await setOptions(rawData);
      // await console.log(options);
    } else {
      console.log(res.error);
    }
  }
  const loadOptions = async (input, callback) => {
    const response = await Axios.get(API_URL + 'place-autocomplete?q=' + input);
    callback(response.data.predictions.map(i => ({ label: i.description, value: i.place_id })));
  }

  const handleInputChange = (newValue) => {
    // function นี้เป็นต้อนที่เราพิมพ์ข้อมูลเข้าไปแล้วจะทำงาน
    if (!newValue) {
      // alert('nulllll')
    } else {
      getData(newValue);
      console.log('handleInputChange', newValue);
    }
  };
  const handleChange = (newValue) => {
    // function นี้เป็นต้อนที่เราคลิ๊กเลือก
    setPlace(newValue)
    setOptions(newValue);
    console.log('handleChange', newValue);
  };

  const getDataList = async () => {
    const res = await Axios.get(API_URL + 'get-data?q=' + place.value)
    await setIsLoading(false);
    if (res.data.success) {
      await setItems(res.data.data);
    } else {
      console.log(res.error);
    }
  }
  const onSubmitForm = async (e) => {
    e.preventDefault()
    // console.log('ค้นหาแล้ว');
    await setIsLoading(true);
    setShowPlace(place)
    getDataList();
    // await setItems(res.data);
    // await console.log(items);
  }

  return (
    <div className="container">
      <Head>
        <title>Create Next App Google Map</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <br />
      <form onSubmit={onSubmitForm}>
        <div className="form-row">
          <div className="col">
            <input type="text" className="form-control-plaintext text-right" value="ค้นหาข้อมูล" readOnly />
          </div>
          <div className="col">
            <AsyncSelect
              value={options}
              onChange={handleChange}
              onInputChange={handleInputChange}
              placeholder={'ค้นหา...'}
              loadOptions={loadOptions}
            // defaultOptions={false}
            />
          </div>
          <div className="col">
            {!isLoading ? <button type="submit" className="btn btn-primary">ตกลง</button>
              : <button type="submit" className="btn btn-primary" disabled>
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
                  <strong>Loading... </strong>
                </div>
              </button>
            }
          </div>
        </div>
      </form>
      <br />
      {/* { state.placeName && (<div>hello {state.placeName}</div>) } */}
      { isLoading && (
        <div className="col text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <br />
      { !isLoading && (
      <div>
        {showPlace.label && (<h5>ผลการค้นหา : {showPlace.label}</h5>)}
        {items.length > 0 && (<p><b>รายการที่ค้นพบ {items.length} รายการ</b></p>)}
        {items.map((item, index) =>
          <div className="card mb-3" key={index}>
            <div className="card-body">
              <h5 className="card-title">{item.name}</h5>
              <span className="card-text small">
                Rating {item.rating}
                {` (${item.user_ratings_total})`}
              </span>
              <br />
              <span className="card-text small">{item.vicinity}</span>
            </div>
          </div>
        )}
      </div>
      )}
    </div >
  )
}
export default Home;