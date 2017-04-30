import React, { Component } from 'react';
import request from 'superagent';
import Repository from './components/Repository';
import Loading from './components/Loading';
import Error from './components/Error';
import './App.css';

class App extends Component {
  constructor() {
    super();

    let repoType = 'all';
    const r = Math.random();
    if (r > .67) repoType = 'fresh';
    else if (r > .33) repoType = 'new';

    this.state = {
      repos: [],
      featured: -1,
      repoType
    };
  }

  getQueryDate() {
    let dt = new Date();
    dt.setDate(dt.getDate() - 30);
    const m = dt.getMonth() + 1;
    return dt.getFullYear() + '-' + (m > 9 ? m : '0' + m) + '-' + dt.getDate();
  }

  componentDidMount() {
    this.loadRepos(this.state.repoType);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.repoType !== nextState.repoType) {
      this.loadRepos(nextState.repoType);
    }
  }

  loadRepos(repoType) {
    let query = 'topic:react';
    switch (repoType) {
      case 'new':
        query += '+created:>=' + this.getQueryDate();
        break;
      case 'fresh':
        query += '+pushed:>=' + this.getQueryDate();
        break;
      case 'all':
      default:
        break;
    }
    this.setState({ loading: true, error: false, repos: [], featured: -1 });
    const url = 'https://api.github.com/search/repositories?q=' + query + '&sort:stars';
    request
      .get(url)
      .end((err, res) => {
        if (err) {
          console.error(err);
          this.setState({ loading: false, error: true });
          return;
        }

        const idx = Math.floor(Math.random() * res.body.items.length);
        this.setState({
          loading: false,
          repos: res.body.items,
          featured: idx
        });
      });
  }

  get repoTypeName() {
    const { repoType } = this.state;

    switch (repoType) {
      case 'new': return 'Popular new repos';
      case 'fresh': return 'Popular fresh repos';
      default: return 'Most popular repos';
    }
  }

  render() {
    const { repos, featured, loading, error, repoType } = this.state;
    const fr = featured >= 0 && repos[featured];

    if (error) return <Error msg='Something went wrong. Perhaps the rate limit was exceeded (max 10 updates per minute).' />;

    return (
      <div className='app'>
        {loading && <Loading />}
        <div className='toolbar'>
          <button className='random' onClick={() => this.setState({ featured: Math.floor(Math.random() * repos.length) })}>Show another</button>
          <div className='btn-group'>
            <button className={repoType === 'all' ? 'active' : ''} onClick={() => this.setState({ repoType: 'all' })}>All time</button>
            <button className={repoType === 'new' ? 'active' : ''} onClick={() => this.setState({ repoType: 'new' })}>New</button>
            <button className={repoType === 'fresh' ? 'active' : ''} onClick={() => this.setState({ repoType: 'fresh' })}>Fresh</button>
          </div>
        </div>
        {fr && <Repository className='featured' repo={fr} readme />}
        <div className='topten'>
          <h1>{this.repoTypeName}</h1>
          <div className='entries'>
            {repos.slice(0, 10).map((r, i) => <Repository key={r.id} className='entry' repo={r} />)}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
