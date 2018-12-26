import { Component } from 'react';
import PropTypes from 'prop-types';

import { Query } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import List from 'react-virtualized/dist/commonjs/List';

import { Q_GET_IMAGES } from '@/graphql/queries';

@withStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: '100%',
  },
  subheader: {
    width: '100%',
  },
}))
class ImageList extends Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  };

  apolloArgs = {
    skip: 0,
    limit: 10,
  };

  isRowLoaded = allImages => ({ index }) => !!allImages[index];

  rowRenderer = allImages => ({ key, index, style }) => {
    const tile = allImages[index] || {};

    return (
      <GridListTile style={style} key={key} cols={2}>
        {/* <LazyLoad
          height={140}
          placeholder={<CircularProgress />}
          debounce={500}
        > */}
        <img src={tile.url} alt={tile.title} />
        {/* </LazyLoad> */}
      </GridListTile>
    );
  };

  loadMoreImages = fetchMore => ({ startIndex, stopIndex }) => {
    clearTimeout(this.loadRowsTimeout);

    this.loadRowsTimeout = setTimeout(() => {
      fetchMore({
        variables: {
          skip: startIndex + stopIndex,
          // limit: 10,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          return {
            ...previousResult,
            // Append the new posts results to the old one
            allImages: [
              ...previousResult.allImages,
              ...fetchMoreResult.allImages,
            ],
          };
        },
      });
    }, 2000);
  };

  render() {
    const { classes } = this.props;

    return (
      <Query query={Q_GET_IMAGES} variables={this.apolloArgs}>
        {({
          loading,
          error,
          data: { allImages = [], _allImagesMeta = { count: 0 } },
          fetchMore,
        }) => {
          // if (error) return <ErrorMessage message="Error loading posts." />;

          if (loading) return <div>Loading</div>;

          // const areMorePosts = allImages.length < _allImagesMeta.count;

          return (
            <Paper className={classes.root}>
              <GridList cellHeight="auto" className={classes.gridList} cols={3}>
                <InfiniteLoader
                  isRowLoaded={this.isRowLoaded(allImages)}
                  loadMoreRows={this.loadMoreImages(fetchMore)}
                  rowCount={_allImagesMeta.count} // minimumBatchSize={100}
                  threshold={10}
                >
                  {(
                    { onRowsRendered, registerChild } // <WindowScroller>
                  ) => (
                    // {(height, isScrolling, scrollTop) => (
                    <AutoSizer disableHeight>
                      {({ width }) => (
                        <List // height={height}
                          // autoHeight
                          height={1000}
                          className="List"
                          onRowsRendered={onRowsRendered}
                          ref={registerChild}
                          rowCount={_allImagesMeta.count}
                          rowHeight={200}
                          rowRenderer={this.rowRenderer(allImages)}
                          width={width}
                        />
                      )
                      // scrollTop={scrollTop}
                      }
                    </AutoSizer>
                  )
                  // )}
                  // </WindowScroller>
                  }
                </InfiniteLoader>
              </GridList>
            </Paper>
          );
        }}
      </Query>
    );
  }
}

export default ImageList;
