#!/usr/bin/env ruby

require 'fileutils'

types = ['stateless', 'stateful']

type = ARGV[0]
tmpname = ARGV[1]
    
name = tmpname.slice(0,1).capitalize + tmpname.slice(1..-1)

return if !types.include?(type)

imports = """import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import s from './#{name}.scss';

const className = classNames({
    [s.#{name}]: true,
});

"""

testBoilerplate = """import React from 'react';
import renderer from 'react-test-renderer';
import #{name} from './#{name}';

describe('<#{name} />', () => {
    it('#{name} component should render correctly.', () => {
        const tree = renderer
            .create(
                <#{name} />
            )
            .toJSON();

        expect(tree).toMatchSnapshot();
    });
});
"""

proptypes ="""#{name}.defaultProps = {
};

#{name}.propTypes = {
};

export default #{name};
"""

jsBoilerplate = """#{imports}
const #{name} = ({

}) => {
    
    return (
        <div className={className}>
            #{name}
        </div>
    );
};

#{proptypes}
"""

jsBoilerplateStateful = """#{imports}
class #{name} extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {

        } = this.props;

        return (
            <div className={className}>
                #{name}
            </div>
        );
    }
};

#{proptypes}
"""

scssBoilerplate = """.#{name} {

}
"""

FileUtils.mkdir_p("./tmp/#{name}")

componentPath = "tmp/#{name}/#{name}";

case type
when "stateless"
  STDOUT.puts "add stateless component #{name}"

  File.open("#{componentPath}.js", 'w+') do |file|
    file.write(jsBoilerplate)
  end
  STDOUT.puts "#{componentPath}.js written."

  File.open("#{componentPath}.test.js", 'w+') do |file|
    file.write(testBoilerplate)
  end
  STDOUT.puts "#{componentPath}.test.js written."

  File.open("#{componentPath}.scss", 'w+') do |file|
    file.write(scssBoilerplate)
  end
  STDOUT.puts "#{componentPath}.scss written."

  STDOUT.puts ""
  STDOUT.puts "================="
  STDOUT.puts "added #{componentPath} stateless component."
  STDOUT.puts "check the result and move it to the desired location."
  STDOUT.puts "================="
when "stateful"
  STDOUT.puts "add stateful component #{name}"

  File.open("#{componentPath}.js", 'w+') do |file|
    file.write(jsBoilerplateStateful)
  end
  STDOUT.puts "#{componentPath}.js written."

  File.open("#{componentPath}.test.js", 'w+') do |file|
    file.write(testBoilerplate)
  end
  STDOUT.puts "#{componentPath}.test.js written."

  File.open("#{componentPath}.scss", 'w+') do |file|
    file.write(scssBoilerplate)
  end
  STDOUT.puts "#{componentPath}.scss written."

  STDOUT.puts ""
  STDOUT.puts "================="
  STDOUT.puts "added #{componentPath} stateful component."
  STDOUT.puts "check the result and move it to the desired location."
  STDOUT.puts "================="
else
  STDOUT.puts <<-EOF
    Please provide a valid component type

    Usage:
        ruby add-component.rb stateless Name
        ruby add-component.rb stateful Name
    EOF
end
