import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Query, Mutation } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';
import pink from '@material-ui/core/colors/pink';
import brown from '@material-ui/core/colors/brown';
import green from '@material-ui/core/colors/green';

import { Q_CAPTIONS, Q_IMG_BY_IDS } from '@/graphql/queries';
import { M_EDIT_CAPTION } from '@/graphql/mutations';

import EditCaption from '@/components/Form/EditCaption';

@withStyles({
  list: {
    marginBottom: '72px',
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
})
class Captions extends Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  };

  avatarColor = [
    'orangeAvatar',
    'purpleAvatar',
    'brownAvatar',
    'pinkAvatar',
    'greenAvatar',
  ];

  render() {
    const { classes } = this.props;

    return (
      <Query query={Q_CAPTIONS}>
        {({
          loading: loadingCaptions,
          error: errorCaptions,
          data: {
            currentUser: { captionEdit = [], captionEditCount = 0 } = {},
          },
          // fetchMore,
          refetch: refetchCaptions,
        }) => {
          if (loadingCaptions) return <div>Loading</div>;

          const captionEditImageId = captionEdit.reduce((re, current) => {
            /* eslint-disable camelcase */
            const image_id =
              current.caption_id > 5 ? Math.ceil(current.caption_id / 5) : 1;

            if (!re.includes(image_id)) {
              re.push(image_id);
            }

            return re;
          }, []);

          return (
            <Query query={Q_IMG_BY_IDS} variables={{ ids: captionEditImageId }}>
              {({
                loading: loadingImages,
                error: errorImages,
                data: { findImgUrlsByIds = [] },
              }) => {
                const captionsModified = findImgUrlsByIds.reduce(
                  (arr, image) => {
                    if (image.captions.length > 0) {
                      image.captions.forEach(caption => {
                        const captionEditEntity = captionEdit.find(
                          capt => capt.caption_id === caption.caption_id
                        );

                        if (captionEditEntity) {
                          arr.push({
                            ...caption,
                            id: captionEditEntity.text,
                          });
                        }
                      });
                    }
                    return arr;
                  },
                  []
                );

                if (loadingImages) return <div>Loading</div>;

                return (
                  <List className={classes.list}>
                    {captionsModified.map((caption, idx) => (
                      <Fragment key={caption.caption_id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              className={classes[this.avatarColor[idx % 4]]}
                            >
                              {caption.caption_id}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={caption.id} />
                          {findImgUrlsByIds[idx] && (
                            <Mutation mutation={M_EDIT_CAPTION}>
                              {editAction => (
                                <ListItemSecondaryAction>
                                  <EditCaption
                                    image={findImgUrlsByIds[idx].coco_url}
                                    imageHeight={findImgUrlsByIds[idx].height}
                                    imageWidth={findImgUrlsByIds[idx].width}
                                    caption={caption}
                                    action={editAction}
                                    refetch={refetchCaptions}
                                  />
                                </ListItemSecondaryAction>
                              )}
                            </Mutation>
                          )}
                        </ListItem>
                        {idx !== captionEditCount - 1 && (
                          <li>
                            <Divider />
                          </li>
                        )}
                      </Fragment>
                    ))}
                  </List>
                );
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}

export default Captions;
