import React, { Component } from 'react';
import PropTypes from 'prop-types';
import request from 'superagent';
import ReactMarkdown from 'react-markdown';
import Stars from './Stars';
import Loading from './Loading';
import './Repository.css';

export default class Repository extends Component {
  static propTypes = {
    repo: PropTypes.object.isRequired,
    readme: PropTypes.bool
  }

  state = {}

  get rootUrl() {
    const { repo } = this.props;
    return 'https://raw.githubusercontent.com/' + repo.full_name + '/' + repo.default_branch + '/';
  }

  componentDidMount() {
    const { readme } = this.props;

    if (readme) {
      this.setState({ loading: true });
      request
        .get(this.rootUrl + 'README.md')
        .end((err, res) => {
          if (err) {
            request
              .get(this.rootUrl + 'readme.md')
              .end((err, res) => {
                if (err) return;

                this.setReadme(res.text);
              })
            return;
          }
          this.setReadme(res.text);
        });
    }
  }

  setReadme(readme) {
    readme = readme
        .replace(/<script/g, '<div style="display:none"')
        .replace(/<\/script/g, '</div')
        .replace(/<!--.*?-->/g, '')
        .replace(/(src=['"])(?!https?:\/\/)/g, '$1' + this.rootUrl)

    this.setState({
      loading: false,
      readme
    });
  }

  render() {
    const { repo, className } = this.props;
    const { readme, loading } = this.state;
    const rootUrl = this.rootUrl;

    return (
      <div className={(className || '') + ' repository'}>
        <h2><a className='owner' href={repo.owner.html_url}>{repo.owner.login}</a> / <a href={repo.html_url}>{repo.name}</a></h2>
        <Stars count={repo.stargazers_count} />
        <p>{repo.description}</p>
        {loading && <Loading />}
        {readme &&
          <ReactMarkdown
            className='readme'
            source={readme}
            transformImageUri={uri => {
              return uri.startsWith('http') ? uri : rootUrl + uri
            }}
          />
        }
      </div>
    )
  }
}
