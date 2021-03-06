import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import FriendInvitationToggle from "./FriendInvitationToggle";
import ImageHandler from "../ImageHandler";
import FriendActions from "../../actions/FriendActions";
import { numberWithCommas, removeTwitterNameFromDescription } from "../../utils/textFormat";
import { renderLog } from "../../utils/logging";

export default class FriendInvitationDisplayForList extends Component {
  static propTypes = {
    children: PropTypes.array, // A list of the tags in FriendDisplayForList when called (e.g. from FriendInvitationList)
    invitationsSentByMe: PropTypes.bool,
    voter_we_vote_id: PropTypes.string,
    voter_photo_url_medium: PropTypes.string,
    voter_display_name: PropTypes.string,
    voter_twitter_handle: PropTypes.string,
    voter_twitter_description: PropTypes.string,
    voter_twitter_followers_count: PropTypes.number,
    voter_email_address: PropTypes.string,
  };

  deleteFriendInviteEmail (voter_email_address) {
    // TODO DALE We have a problem with how we are deleting friend invitations.
    // It has to do with retrieve_friend_invitations_sent_by_me on the API server
    // console.log("deleteFriendInviteEmail");
    FriendActions.deleteFriendInviteEmail(voter_email_address);
  }

  deleteFriendInviteVoter (other_voter_we_vote_id) {
    // console.log("deleteFriendInviteVoter");
    FriendActions.deleteFriendInviteVoter(other_voter_we_vote_id);
  }

  handleIgnore (voter_we_vote_id) {
    FriendActions.ignoreFriendInvite(voter_we_vote_id);
    this.setState({
      friend_invitations_list: this.state.friend_invitations_list.filter( friend => friend.voter_we_vote_id !== voter_we_vote_id),
    });
  }

  render () {
    renderLog(__filename);
    const {
      invitationsSentByMe,
      voter_twitter_followers_count,
      voter_we_vote_id,
      voter_photo_url_medium,
    } = this.props;

    const voter_display_name = this.props.voter_display_name ? this.props.voter_display_name : this.props.voter_email_address;
    const twitterDescription = this.props.voter_twitter_description ? this.props.voter_twitter_description : "";
    // If the voter_display_name is in the voter_twitter_description, remove it
    const twitterDescriptionMinusName = removeTwitterNameFromDescription(voter_display_name, twitterDescription);

    // TwitterHandle-based link
    const voterGuideLink = this.props.voter_twitter_handle ? `/${this.props.voter_twitter_handle}` : null;
    const voter_image = <ImageHandler sizeClassName="image-lg " imageUrl={voter_photo_url_medium} kind_of_ballot_item="CANDIDATE" />;
    const voter_display_name_formatted = <span className="card-child__display-name">{voter_display_name}</span>;
    // console.log("FriendInvitationDisplayForList, this.props.voter_we_vote_id:", this.props.voter_we_vote_id);

    const delete_invitation_html = "";

    return (
      <div className="position-item card-child card-child--not-followed">
        <div className="card-child__avatar">
          { voterGuideLink ? (
            <Link to={voterGuideLink} className="u-no-underline">
              {voter_image}
            </Link>
          ) :
            <span>{voter_image}</span> }
        </div>
        <div className="card-child__media-object-content">
          <div className="card-child__content">
            { voterGuideLink ? (
              <Link to={voterGuideLink} className="u-no-underline">
                {voter_display_name_formatted}
              </Link>
            ) :
              <span>{voter_display_name_formatted}</span> }
            { invitationsSentByMe ?
              <span> has an open invitation from you.</span> :
              <span> invited you.</span>}
            { twitterDescriptionMinusName ? <p>{twitterDescriptionMinusName}</p> : null }
          </div>
          <div className="card-child__additional">
            <div className="card-child__follow-buttons">
              { this.props.invitationsSentByMe ?
                <span>{delete_invitation_html}</span> : (
                  <span>
                    <FriendInvitationToggle other_voter_we_vote_id={voter_we_vote_id} />
                    <button
                      className="btn btn-default btn-sm"
                      onClick={this.handleIgnore.bind(this, voter_we_vote_id)}
                    >
                  Ignore
                    </button>
                  </span>
                )}
            </div>
            {voter_twitter_followers_count ? (
              <span className="twitter-followers__badge">
                <span className="fa fa-twitter twitter-followers__icon" />
                {numberWithCommas(voter_twitter_followers_count)}
              </span>
            ) : null
            }
          </div>
        </div>
      </div>
    );
  }
}
