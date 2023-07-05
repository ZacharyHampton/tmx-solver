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

    script = site.get_config_script()

    #: static for now, will be dynamic in the future
    #: for ebay
    profiling_url = site.get_tmx_profiling_url(script, '280fdf771890a9f0bb8044bfffffe30c', ["6"])


if __name__ == '__main__':
    main()
