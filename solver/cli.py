from argparse import ArgumentParser
from solver.api.core.solver.sites import site_list


def main():
    parser = ArgumentParser(description='Testing CLI for ThreatMatrix solver.')
    parser.add_argument('domain', help='Domain to be tested.')

    args = parser.parse_args()

    if args.domain not in site_list:
        print('Domain not supported.')
        return

    site = site_list[args.domain]

    print(f'Testing {site.site_name.lower()} solver...')
    assert site.test_solve()
    print('Test passed.')


if __name__ == '__main__':
    main()
