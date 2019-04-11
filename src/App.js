import React, { Component } from "react";

//import logo from './logo.svg';
import "./App.css";
import axios from "axios";

const TAB_CONFIG = [
  {
    title: "Get all Categories",
    key: "getCategory"
  },
  {
    title: "Get Best Cuisines",
    key: "getBestCusines"
  },
  {
    title: "Get Best Restaurants",
    key: "getBestRestraunts"
  },
  {
    title: "Get Collections",
    key: "getCollections"
  },
  {
    title: "Get Review",
    key: "getReview"
  }
];

const BASE_PATH = "https://developers.zomato.com/api/v2.1";

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      result: [],
      btnone: false,
      btntwo: false,
      btnthree: false,
      btnfour: false,
      btnfive: false,
      location: [],
      geoloc: [],
      reviews: [],
      optionItems: "",
      headers: {
        headers: {
          "Content-Type": "application/json",
          "user-key": "ef2edf54aa26ff26d207505c6d450c13"
        }
      },
      restuflag: "0",
      restu_html: [],
      collec: [],
      searchword: "",
      coll_type: "",
      coll_id: "",
      restu_id: "",
      coll_restu: [],
      selectValue: "",
      city_name: "",
      city_id: "",
      activeTab: "getCategory"
    };
  }

  getcollection = ev => {
    axios
      .get(
        `${BASE_PATH}/search?collection_id=${this.state.coll_id}`,
        this.state.headers
      )
      .then(res => {
        this.setState({ coll_restu: res.data });
      })
      .catch(reason => {
        console.error(reason);
      });
  };

  /**
   * @param ev event
   * @param onChnage [false]
   */

  fetchCordinatesAndGetRestarauntDetails = (ev, onChnage = false) => {
    var lat, lon;

    onChnage && this.onInputChnageHandler(ev, "searchword");
    axios
      .get(
        `${BASE_PATH}/locations?query=${this.state.searchword}`,
        this.state.headers
      )
      .then(res => {
        this.setState({ location: res.data.location_suggestions[0] });

        lat = this.state.location.latitude;
        lon = this.state.location.longitude;

        axios
          .get(`${BASE_PATH}/geocode?lat=${lat}&lon=${lon}`, this.state.headers)
          .then(res => {
            this.setState({ geoloc: res.data });
          });
      })
      .catch(reason => {
        console.error(reason);
      });
  };

  onInputChnageHandler = (ev, state_key) => {
    this.setState({ [state_key]: ev.target.value });
  };

  getid = ev => {
    this.onInputChnageHandler(ev, "city_name");
    axios
      .get(
        `${BASE_PATH}/locations?query=${this.state.city_name}`,
        this.state.headers
      )
      .then(res => {
        this.setState({
          city_id:
            res.data &&
            res.data.location_suggestions &&
            res.data.location_suggestions[0] &&
            res.data.location_suggestions[0].city_id
        });

        axios
          .get(
            `${BASE_PATH}/collections?city_id=${this.state.city_id}`,
            this.state.headers
          )
          .then(res => {
            this.setState({ collec: res.data });
          });
      })
      .catch(reason => {
        console.error(reason);
      });
  };

  getreview = () => {
    const local = this;
    axios
      .get(
        `${BASE_PATH}/reviews?res_id=${local.state.restu_id}`,
        local.state.headers
      )
      .then(res => {
        local.setState({ reviews: res.data });
      })
      .catch(reason => {
        console.error(reason);
      });
  };

  tabChangeHandler = tab => {
    this.setState({
      activeTab: tab,
      geoloc: [],
      searchword: "",
      coll_restu: [],
      collec: "",
      reviews: []
    });
  };

  categoryFetchHanler = type => {
    if (type === "getCategory") {
      axios
        .get(`${BASE_PATH}/categories`, this.state.headers)
        .then(res => {
          this.setState({ result: res.data });
        })
        .catch(reason => {
          console.error(reason);
        });
    }
  };

  render() {
    return (
      <div className="App">
        <div className="zoma">Zomato</div>
        <div className="clicking">
          {TAB_CONFIG.map(d => (
            <button
              className="catbtn"
              onClick={() => {
                this.tabChangeHandler(d.key);
                this.categoryFetchHanler(d.key);
              }}
            >
              {d.title}
            </button>
          ))}
        </div>
        <div>
          {this.state.activeTab === "getCategory" && (
            <div>
              {this.state.result.categories &&
                this.state.result.categories.length > 0 &&
                this.state.result.categories.map(list => (
                  <table>
                    <tr>
                      <td> {list.categories.id}</td>
                      <td>{list.categories.name}</td>
                    </tr>
                  </table>
                ))}
            </div>
          )}

          {this.state.activeTab === "getBestCusines" && (
            <div>
              <span>Enter City Name</span>
              <input
                type="text"
                id="restau_name"
                onChange={e => this.onInputChnageHandler(e, "searchword")}
              />
              <button
                className=""
                onClick={e => this.fetchCordinatesAndGetRestarauntDetails(e)}
              >
                Get details
              </button>
              BEST CUISINES IN THE CITY:
              {this.state.geoloc &&
                this.state.geoloc.popularity &&
                this.state.geoloc.popularity.top_cuisines &&
                this.state.geoloc.popularity.top_cuisines.map(list => (
                  <div>{list}</div>
                ))}
            </div>
          )}

          {this.state.activeTab === "getBestRestraunts" && (
            <div>
              <span>Enter City Name</span>
              <input
                type="text"
                id="restau_name"
                onChange={e => this.onInputChnageHandler(e, "searchword")}
              />
              <button
                className=""
                onClick={e => this.fetchCordinatesAndGetRestarauntDetails(e)}
              >
                Get details
              </button>
              TOP RESTUARANTS IN THE CITY:
              {this.state.geoloc &&
                this.state.geoloc.nearby_restaurants &&
                this.state.geoloc.nearby_restaurants.map(list => (
                  <div>
                    <br />
                    RESTUARANT NAME:{list.restaurant.name}
                    <br />
                    BEST CUISINES:{list.restaurant.cuisines}
                    <br />
                    ADDRESS: {list.restaurant.location.address}
                    <br />
                    AVERAGE COST FOR TWO:{list.restaurant.average_cost_for_two}
                    <br />
                    USER RATING: {list.restaurant.user_rating.aggregate_rating}
                    <br />
                    USER COMMENT: {list.restaurant.user_rating.rating_text}
                    <br />
                  </div>
                ))}
            </div>
          )}

          {this.state.activeTab === "getCollections" && (
            <div>
              <span>Enter City Name</span>
              <input type="text" id="restau_name" onChange={this.getid} />
              SELECT AN OPTION:
              <select onChange={e => this.onInputChnageHandler(e, "coll_id")}>
                <option>Select</option>
                {this.state.collec &&
                  this.state.collec.collections &&
                  this.state.collec.collections.map(col => (
                    <option value={col.collection.collection_id}>
                      {col.collection.title}
                    </option>
                  ))}
              </select>
              <button className="" onClick={this.getcollection}>
                Get restaurants
              </button>
              {this.state.coll_restu &&
                this.state.coll_restu.restaurants &&
                this.state.coll_restu.restaurants.map(list => (
                  <div>
                    <br />
                    RESTUARANT NAME:{list.restaurant.name}
                    <br />
                    BEST CUISINES:{list.restaurant.cuisines}
                    <br />
                    ADDRESS: {list.restaurant.location.address}
                    <br />
                    AVERAGE COST FOR TWO:{list.restaurant.average_cost_for_two}
                    <br />
                    USER RATING: {list.restaurant.user_rating.aggregate_rating}
                    <br />
                    USER COMMENT: {list.restaurant.user_rating.rating_text}
                    <br />
                  </div>
                ))}
            </div>
          )}

          {this.state.activeTab === "getReview" && (
            <div>
              Enter city:
              <input
                type="text"
                id="restau_name"
                onChange={e =>
                  this.fetchCordinatesAndGetRestarauntDetails(e, true)
                }
              />
              Choose Restaurant:
              <select onChange={e => this.onInputChnageHandler(e, "restu_id")}>
                <option>Select</option>

                {this.state.geoloc &&
                  this.state.geoloc.nearby_restaurants &&
                  this.state.geoloc.nearby_restaurants.map(list => (
                    <option value={list.restaurant.R.res_id}>
                      {list.restaurant.name}
                    </option>
                  ))}
              </select>
              <button onClick={this.getreview}>Get Review</button>
              {this.state.reviews &&
                this.state.reviews.user_reviews &&
                this.state.reviews.user_reviews.map(list => (
                  <div>
                    <br />
                    <br />
                    UserName : {list.review.user.name}
                    <br />
                    About user: {list.review.user.foodie_level}
                    <br />
                    Rating : {list.review.rating_text}
                    <br />
                    Overall rating: {list.review.rating}
                    <br />
                    Comment: {list.review.review_text}
                    <br />
                    Posted on: {list.review.review_time_friendly}
                    <br />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
