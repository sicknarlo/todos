import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'; // XXX: SESSION
import { Lists } from '../../api/lists/lists.js';
import UserMenu from '../components/UserMenu.jsx';
import ListList from '../components/ListList.jsx';
import ConnectionNotification from '../components/ConnectionNotification.jsx';
import Loading from '../components/Loading.jsx';
import $ from 'jquery';

const CONNECTION_ISSUE_TIMEOUT = 5000;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuOpen: false,
            showConnectionIssue: false,
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.logout = this.logout.bind(this);
    }
    componentWillMount() {
        // Minimalize menu when screen is less than 768px
        $(window).bind('resize load', function() {
            if ($(this).width() < 769) {
                $('body').addClass('body-small');
            } else {
                $('body').removeClass('body-small');
            }
        });

        // Fix height of layout when resize, scroll and load
        $(window).bind('load resize scroll', function() {
            if (!$('body').hasClass('body-small')) {
                const navbarHeigh = $('nav.navbar-default').height();
                const wrapperHeigh = $('#page-wrapper').height();

                if (navbarHeigh > wrapperHeigh) {
                    $('#page-wrapper').css('min-height', `${navbarHeigh}px`);
                }

                if (navbarHeigh < wrapperHeigh) {
                    $('#page-wrapper').css('min-height', `${$(window).height()}px`);
                }

                if ($('body').hasClass('fixed-nav')) {
                    if (navbarHeigh > wrapperHeigh) {
                        $('#page-wrapper').css('min-height', `${navbarHeigh - 60}px`);
                    } else {
                        $('#page-wrapper').css('min-height', `${$(window).height() - 60}px`);
                    }
                }
            }
        });


        // SKIN OPTIONS
        // Uncomment this if you want to have different skin option:
        // Available skin: (skin-1 or skin-3, skin-2 deprecated, md-skin)
        $('body').addClass('md-skin');

        // FIXED-SIDEBAR
        // Uncomment this if you want to have fixed left navigation
        // $('body').addClass('fixed-sidebar');
        // $('.sidebar-collapse').slimScroll({
        //     height: '100%',
        //     railOpacity: 0.9
        // });

        // BOXED LAYOUT
        // Uncomment this if you want to have boxed layout
        // $('body').addClass('boxed-layout');
    }

    componentDidMount() {
        setTimeout(() => {
        /* eslint-disable react/no-did-mount-set-state */
            this.setState({ showConnectionIssue: true });
        }, CONNECTION_ISSUE_TIMEOUT);
    }

    componentWillReceiveProps({ loading, children }) {
        // redirect / to a list once lists are ready
        if (!loading && !children) {
            const list = Lists.findOne();
            this.context.router.replace(`/lists/${list._id}`);
        }
    }

    toggleMenu(menuOpen = !Session.get('menuOpen')) {
        Session.set({menuOpen});
    }

    logout() {
        Meteor.logout();

        // if we are on a private list, we'll need to go to a public one
        if (this.props.params.id) {
            const list = Lists.findOne(this.props.params.id);
            if (list.userId) {
                const publicList = Lists.findOne({ userId: { $exists: false } });
                this.context.router.push(`/lists/${publicList._id}`);
            }
        }
    }

    render() {
        const { showConnectionIssue } = this.state;
        const {
            user,
            connected,
            loading,
            lists,
            menuOpen,
            children,
            location,
        } = this.props;

        const closeMenu = this.toggleMenu.bind(this, false);

        // clone route components with keys so that they can
        // have transitions
        const clonedChildren = children && React.cloneElement(children, {
            key: location.pathname,
        });

        return (
          <div id="container" className={menuOpen ? 'menu-open' : ''}>
            <section id="menu">
              <UserMenu user={user} logout={this.logout} />
              <ListList lists={lists} />
            </section>
            {showConnectionIssue && !connected
              ? <ConnectionNotification />
              : null}
            <div className="content-overlay" onClick={closeMenu}></div>
            <div id="content-container">
              <ReactCSSTransitionGroup
                transitionName="fade"
                transitionEnterTimeout={200}
                transitionLeaveTimeout={200}
              >
                {loading
                  ? <Loading key="loading" />
                  : clonedChildren}
              </ReactCSSTransitionGroup>
            </div>
          </div>
        );
    }
}

App.propTypes = {
    user: React.PropTypes.object,      // current meteor user
    connected: React.PropTypes.bool,   // server connection status
    loading: React.PropTypes.bool,     // subscription status
    menuOpen: React.PropTypes.bool,    // is side menu open?
    lists: React.PropTypes.array,      // all lists visible to the current user
    children: React.PropTypes.element, // matched child route component
    location: React.PropTypes.object,  // current router location
    params: React.PropTypes.object,    // parameters of the current route
};

App.contextTypes = {
    router: React.PropTypes.object,
};
