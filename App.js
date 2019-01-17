import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  SafeAreaView,
  FlatList,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import formatDate from './date';
import LoadingAnimation from './LoadingAnimation';

const { height, width } = Dimensions.get('window');
const DH = height;
const DW = width;

// may need internal IP on android
const URL = 'http://localhost:3000';
const URL_PRODUCTS = '/products';
const URL_ADS = '/ads';

const SORT_TYPES = [
  {
    label: 'price',
    value: 'price'
  },
  {
    label: 'size',
    value: 'size'
  },
  {
    label: 'id',
    value: 'id'
  }
];

// Api limit roughly based on remaining height as tested on iPhone X
// Formula is: 1/2 of Device Height divided by product height times numColumns
let api_limit = Math.round((DH / 2 / 100) * 2);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      page: 1,
      sort: 'price',
      onEndReached: false,
      noData: false
    };
  }

  componentDidMount() {
    this._fetchProducts();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.sort !== prevState.sort) {
      this._fetchProducts();
    }

    if (this.state.onEndReached !== prevState.onEndReached) {
      fetch(
        URL +
          URL_PRODUCTS +
          '?_limit=' +
          api_limit +
          '&_sort=' +
          this.state.sort +
          '&_page=' +
          this.state.page
      )
        .then(response => response.json())
        .then(responseJson => {
          const length = Object.keys(responseJson).length;

          if (length === 0) {
            this.setState({
              noData: true,
              onEndReached: false
            });
          } else {
            this.setState(prevState => ({
              data: prevState.data.concat(responseJson),
              page: prevState.page + 1,
              onEndReached: false
            }));
          }
        })
        .catch(error => {
          //ignored. api won't fail anyway
        });
    }
  }

  _sort = sort => {
    this.setState({ sort });
  };

  _fetchProducts = () => {
    fetch(
      URL + URL_PRODUCTS + '?_limit=' + api_limit + '&_sort=' + this.state.sort
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ data: responseJson });

        //trigger pre emptive fetch next batch
        this.setState({ onEndReached: true });
      })
      .catch(error => {
        //ignored. api won't fail anyway
      });
  };

  _onEndReached = () => {
    this.setState({ onEndReached: true });
  };

  /* face fontSize is not the same as the api as it will be scaled later
     on using PixelRatio or some scaler depending on the device
  */
  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.face}>{item.face}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
        {(index + 1) % 20 === 0 ? (
          <Image
            style={styles.ad2}
            resizeMode="contain"
            source={{
              uri: URL + URL_ADS + '/?r=' + Math.floor(Math.random() * 1000)
            }}
          />
        ) : null}
      </View>
    );
  };

  _renderListFooter = () => {
    if (this.state.onEndReached) {
      return <LoadingAnimation />;
    } else if (this.state.noData) {
      return <Text style={styles.footer}>~ end of catalogue ~</Text>;
    }

    return null;
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Products Grid</Text>
        <Text style={styles.intro}>
          Here you{"'"}re sure to find a bargain on some of the finest ascii
          available to purchase. Be sure to peruse our selection of ascii faces
          in an exciting range of sizes and prices.
        </Text>
        <Text style={styles.wordFromSponsors}>
          But first, a word from our sponsors:
        </Text>
        <Image
          style={styles.ad}
          source={{
            uri: URL + URL_ADS + '/?r=' + Math.floor(Math.random() * 1000)
          }}
        />

        <View style={styles.sortContainer}>
          <RNPickerSelect
            placeholder={{
              label: 'Sort by: ' + this.state.sort,
              value: this.state.sort
            }}
            items={SORT_TYPES}
            onValueChange={sort =>
              this.setState({
                sort
              })
            }
            value={this.state.sort}
            hideIcon
          >
            <TouchableOpacity style={styles.sortButton} onPress={() => {}}>
              <Text style={styles.sortText}>Sort by: {this.state.sort}</Text>
            </TouchableOpacity>
          </RNPickerSelect>
        </View>

        {/*React Native built in component */}
        <FlatList
          contentContainerStyle={styles.flatListContentContainer}
          keyExtractor={(item, index) => index}
          numColumns={2}
          data={this.state.data}
          renderItem={this._renderItem}
          ListFooterComponent={this._renderListFooter}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.1}
          extraData={this.state.onEndReached}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 10,
    color: 'orange'
  },
  intro: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
    paddingLeft: 25,
    paddingRight: 25
  },
  wordFromSponsors: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 10
  },
  ad: {
    width: DW,
    height: 200
  },
  ad2: {
    width: DW / 2,
    height: 100,
    marginTop: 20
  },
  sortContainer: {
    marginTop: 10,
    paddingRight: 10,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: DW
  },
  sortButton: {
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  sortText: {
    color: 'darkorange'
  },
  flatListContentContainer: {
    width: DW,
    paddingBottom: 10
  },
  item: {
    flex: 1,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    paddingVertical: 5,
    marginVertical: 2,
    marginHorizontal: 3
  },
  face: {
    textAlign: 'center',
    marginBottom: 10
  },
  price: {
    textAlign: 'center',
    color: 'orange'
  },
  date: {
    textAlign: 'center',
    color: 'grey'
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10
  }
});
