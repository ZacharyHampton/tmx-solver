from argparse import ArgumentParser
from api.core.solver.sites import site_list
import requests


def main():
    parser = ArgumentParser(description='Testing CLI for ThreatMatrix solver.')
    parser.add_argument('domain', help='Domain to be tested.')
    parser.add_argument('stage', choices=['dev', 'prod'], help='Stage to be tested.')
    parser.add_argument('--proxy', help='Proxy to be used for testing. (Optional)', required=False)

    args = parser.parse_args()

    if args.domain not in site_list:
        print('Domain not supported.')
        return

    site = site_list[args.domain]
    session_id = site.generate_test_session_id()

    print(f'Testing {site.site_name.lower()} solver...')

    if args.stage == 'prod':
        response = requests.post(
            'https://tmx.zacharysproducts.com/v1/solver/solve',
            json={
                'session_id': session_id,
                'domain': site.site_domain,
                'proxy': args.proxy
            }
        )

        assert response.json()['success']
        assert site.validate_session_id(session_id)
    else:
        assert site.test_solve(session_id, args.proxy)

    print('Test passed.')


if __name__ == '__main__':
    main()
