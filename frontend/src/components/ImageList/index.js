import { Component } from 'react';
import PropTypes from 'prop-types';

import { Query } from 'react-apollo';
import { connect } from 'react-redux';

import debounce from 'lodash/debounce';

import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
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

import CaptionsMutations from '@/components/GraphQL/CaptionsMutations';

import EditCaption from '@/components/Form/EditCaption/index';
import CurateCaption from '@/components/Form/CurateCaption';
import EmotionCaption from '@/components/Form/EmotionCaption';

import StepperForm from './Stepper';

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
@connect(
  state => ({
    user: state.user,
  }),
  ({ message: { setMessage }, user: { setUser } }) => ({
    setMessage,
    setUser,
  })
)
class ImageList extends Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,

    user: PropTypes.shape({}).isRequired,
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

  IMAGE_DOCUMENTS = process.env.IMAGE_DOCUMENTS
    ? parseInt(process.env.IMAGE_DOCUMENTS, 10)
    : 0;

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

  rowDetail = (captionsEntity, refetch) => ({
    row: {
      image_id: id,
      obj_id: objId,
      url,
      captions,
      need_emotion: needEmotion,
    },
  }) => {
    const { classes } = this.props;

    const imageCaption = captionsEntity.find(capt => capt.image_id === id);

    const captionsModified = captions.map(caption => {
      if (!imageCaption) {
        return caption;
      }

      const captionEdit = imageCaption.captionEdit.find(
        capt => capt.caption_id === caption.caption_id
      );

      if (!captionEdit) {
        return caption;
      }

      return { ...caption, id: captionEdit.text };
    });

    return (
      <CaptionsMutations>
        {({
          curateCaption,
          editCaption,
          emotionCaption,
          changeStepCaption,
        }) => (
          <Card key={id} className={classes.card}>
            <CardMedia
              className={classes.cover}
              component="img"
              style={{ height: '75%', width: '75%' }}
              image={url}
              alt={captionsModified[0].en}
              title={captionsModified[0].en}
            />
            <CardContent className={classes.content}>
              <List style={{ margin: 'auto auto' }}>
                <StepperForm
                  id={id}
                  objId={objId}
                  needEmotion={needEmotion}
                  refetch={refetch}
                  changeStepCaption={changeStepCaption.mutation}
                  curateForm={({
                    back,
                    next,
                    stepperClasses,
                    activeStep,
                    steps,
                  }) => (
                    <CurateCaption
                      image={url}
                      objId={objId}
                      imageId={id}
                      parentClasses={classes}
                      avatarColor={this.avatarColor}
                      captionEdit={captionsModified}
                      caption={imageCaption}
                      action={curateCaption}
                      refetch={refetch} /* stepper */
                      handleBack={back}
                      handleNext={next}
                      stepperClasses={stepperClasses}
                      activeStep={activeStep}
                      steps={steps}
                    />
                  )}
                  editForm={({
                    back,
                    next,
                    stepperClasses,
                    activeStep,
                    steps,
                  }) => (
                    <EditCaption
                      image={url}
                      objId={objId}
                      imageId={id}
                      parentClasses={classes}
                      avatarColor={this.avatarColor}
                      caption={imageCaption}
                      captionEdit={captionsModified}
                      action={editCaption}
                      refetch={refetch} /* stepper */
                      handleBack={back}
                      handleNext={next}
                      stepperClasses={stepperClasses}
                      activeStep={activeStep}
                      steps={steps}
                    />
                  )}
                  emotionForm={({
                    back,
                    next,
                    stepperClasses,
                    activeStep,
                    steps,
                  }) => (
                    <EmotionCaption
                      image={url}
                      objId={objId}
                      imageId={id}
                      parentClasses={classes}
                      avatarColor={this.avatarColor}
                      caption={imageCaption}
                      captionEdit={captionsModified}
                      action={emotionCaption}
                      refetch={refetch} /* stepper */
                      handleBack={back}
                      handleNext={next}
                      stepperClasses={stepperClasses}
                      activeStep={activeStep}
                      steps={steps}
                    />
                  )}
                />
              </List>
            </CardContent>
          </Card>
        )}
      </CaptionsMutations>
    );
  };

  errorComponent = () => (
    <span id="message-id">
      GraphQL Error! Will refetching if you click out of this snackbar!
    </span>
  );

  render() {
    const { classes, user } = this.props;
    const { apolloArgs, columns, pageSizes } = this.state;

    const [, end] =
      user.range && user.range !== 'all'
        ? user.range.split('-').map(val => parseInt(val, 10))
        : [1, this.IMAGE_DOCUMENTS];

    return (
      <Query
        query={Q_GET_IMAGES}
        variables={{ skip: apolloArgs.page * apolloArgs.limit, ...apolloArgs }}
        errorPolicy="all"
        fetchPolicy="cache-and-network"
        notifyOnNetworkStatusChange
      >
        {({
          loading,
          data: {
            allImages = [],
            _allImagesMeta = { count: 0 },
            currentUser = {
              obj_id: 0,
              image_id: '',
              step: 'none',
              captionCuratedCount: 0,
              captionEditCount: 0,
              captionEmotionCount: 0,
              captions: [],
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
                <CustomPaging totalCount={end || _allImagesMeta.count} />
                <VirtualTable height="auto" />
                <TableHeaderRow />
                <TableRowDetail
                  contentComponent={this.rowDetail(
                    currentUser.captions,
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
