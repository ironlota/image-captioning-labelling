import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Mutation, Query } from 'react-apollo';

import debounce from 'lodash/debounce';

import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Snackbar from '@material-ui/core/Snackbar';

import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';
import pink from '@material-ui/core/colors/pink';
import brown from '@material-ui/core/colors/brown';
import green from '@material-ui/core/colors/green';

import {
  PagingState,
  CustomPaging,
  RowDetailState,
  SearchState,
} from '@devexpress/dx-react-grid';

import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  TableRowDetail,
  PagingPanel,
  Toolbar,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';

import { Q_GET_IMAGES } from '@/graphql/queries';
import { M_EDIT_CAPTION } from '@/graphql/mutations';

import EditCaption from '@/components/Form/EditCaption';

@withStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    height: '100%',
  },
  gridList: {
    width: 500,
    height: 450,
  },
  subheader: {
    width: '100%',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    margin: 'auto auto',
    objectFit: 'cover',
  },
  orangeAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepOrange[500],
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepPurple[500],
  },
  brownAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: brown[500],
  },
  pinkAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: pink[500],
  },
  greenAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: green[500],
  },
  '@media (min-width: 1200px)': {
    card: {
      display: 'flex',
      padding: '10px',
    },
  },
}))
class ImageList extends Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  };

  defaultApolloArgs = {
    page: 0,
    limit: 30,
    search: '',
  };

  avatarColor = [
    'orangeAvatar',
    'purpleAvatar',
    'brownAvatar',
    'pinkAvatar',
    'greenAvatar',
  ];

  state = {
    apolloArgs: this.defaultApolloArgs,
    columns: [
      { name: 'image_id', title: 'Image ID' },
      {
        name: 'caption',
        title: 'Caption',
        getCellValue: row => (row.captions[0] ? row.captions[0].id : undefined),
      },
    ],
    pageSizes: [30, 40, 50, 60, 70],
  };

  changeSearchValue = debounce(
    (search, refetch) =>
      this.setState(
        state => ({ apolloArgs: { ...state.apolloArgs, search } }),
        () => {
          const { apolloArgs } = this.state;
          refetch({
            skip: apolloArgs.page * apolloArgs.limit,
            ...apolloArgs,
          });
        }
      ),
    500
  );

  changePageSize = (pageSize, refetch) => {
    this.setState(
      state => ({ apolloArgs: { ...state.apolloArgs, limit: pageSize } }),
      () => {
        const { apolloArgs } = this.state;
        refetch({
          skip: apolloArgs.page * apolloArgs.limit,
          ...apolloArgs,
        });
      }
    );
  };

  loadMoreImages = (currentPage, fetchMore) => {
    this.setState(
      state => ({
        ...state,
        apolloArgs: { ...state.apolloArgs, page: currentPage },
      }),
      () => {
        const {
          apolloArgs: { page, limit },
        } = this.state;

        fetchMore({
          variables: {
            skip: page * limit,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }

            return {
              ...previousResult,
              allImages: fetchMoreResult.allImages,
            };
          },
        });
      }
    );
  };

  getRowId = row => row.image_id;

  getChildRows = (row, rootRows) => (row ? row.captions : rootRows);

  rowDetail = (captionEdit, refetch) => ({
    row: { image_id: id, coco_url: coco, captions, height, width },
  }) => {
    const { classes } = this.props;

    const captionsModified = captions.map(caption => {
      const captionEditEntity = captionEdit.find(
        capt => capt.caption_id === caption.caption_id
      );

      if (!captionEditEntity) {
        return caption;
      }

      return { ...caption, id: captionEditEntity.text };
    });

    return (
      <Mutation mutation={M_EDIT_CAPTION}>
        {editAction => (
          <Card key={id} className={classes.card}>
            <CardMedia
              className={classes.cover}
              component="img"
              style={{ height: height * 0.75, width: width * 0.75 }}
              image={coco}
              alt={captionsModified[0].en}
              title={captionsModified[0].en}
            />
            <CardContent className={classes.content}>
              <List>
                {captionsModified.map((caption, idx) => (
                  <Fragment key={caption.caption_id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar className={classes[this.avatarColor[idx]]}>
                          {caption.caption_id}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={caption.id}
                        secondary={caption.en}
                      />
                      <ListItemSecondaryAction>
                        <EditCaption
                          image={coco}
                          imageHeight={height}
                          imageWidth={width}
                          caption={caption}
                          action={editAction}
                          refetch={refetch}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    {idx !== captions.length - 1 && (
                      <li>
                        <Divider inset />
                      </li>
                    )}
                  </Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Mutation>
    );
  };

  errorComponent = () => (
    <span id="message-id">
      GraphQL Error! Will refetching if you click out of this snackbar!
    </span>
  );

  render() {
    const { classes } = this.props;
    const { apolloArgs, columns, pageSizes } = this.state;

    return (
      <Query
        query={Q_GET_IMAGES}
        variables={{ skip: apolloArgs.page * apolloArgs.limit, ...apolloArgs }}
        errorPolicy="all"
        notifyOnNetworkStatusChange
      >
        {({
          loading,
          data: {
            allImages = [],
            _allImagesMeta = {
              count: 0,
            },
            currentUser = {
              captionEditCount: 0,
              captionEdit: [],
            },
          },
          fetchMore,
          refetch,
          error,
        }) => {
          if (error) {
            return (
              <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={!error}
                onClose={() => refetch()}
                ContentProps={{ 'aria-describedby': 'message-id' }}
                message={this.errorComponent()}
              />
            );
          }

          return (
            <Paper className={classes.root}>
              <Grid
                rows={allImages}
                columns={columns}
                getRowId={this.getRowId}
                style={{ height: '100%' }}
              >
                {loading && <CircularProgress />}
                <SearchState
                  onValueChange={value =>
                    this.changeSearchValue(value, refetch)
                  }
                />
                <PagingState
                  currentPage={apolloArgs.page}
                  onCurrentPageChange={_currentPage =>
                    this.loadMoreImages(_currentPage, fetchMore)
                  }
                  pageSize={apolloArgs.limit}
                  onPageSizeChange={_pageSize =>
                    this.changePageSize(_pageSize, refetch)
                  }
                />
                <RowDetailState />
                <CustomPaging totalCount={_allImagesMeta.count} />
                <VirtualTable height="auto" />
                <TableHeaderRow />
                <TableRowDetail
                  contentComponent={this.rowDetail(
                    currentUser.captionEdit,
                    refetch
                  )}
                />
                <PagingPanel pageSizes={pageSizes} />
                <Toolbar />
                <SearchPanel />
              </Grid>
            </Paper>
          );
        }}
      </Query>
    );
  }
}

export default ImageList;
