export const validationMessage = {
    above: 'The {{ field }} should be above {{ argument.0 }}.',
    accepted: 'The {{ field }} should have been accepted',
    after: 'The {{ field }} should be a date after {{ argument.0 }}',
    after_offset_of:
        'The {{ field }} should be after {{ argument.0 }} {{ argument.1 }} from today’s date',
    alpha: 'The {{ field }} should contain letters only',
    alpha_numeric: 'The {{ field }} should contain letters and numbers only',
    array: 'The {{ field }} should be an ARRAY.',
    before: 'The {{ field }} should be a date before {{ argument.0 }}.',
    before_offset_of:
        'The {{ field }} should be before {{ argument.0 }} {{ argument.1 }} from today’s date',
    between: 'The {{ field }} should be between {{ argument.0 }} and {{ argument.1 }}.',
    boolean: 'The {{ field }} should be true or false.',
    confirmed: 'The {{ field }} confirmation does not match.',
    date: 'The {{ field }} should be a valid date',
    date_format:
        'The {{ field }} should be a valid date according to given format {{ argument.0 }}.',
    different: 'The {{ field }} and {{ argument.0 }} should be different.',
    email: 'The {{ field }} should be a valid email address.',
    ends_with: 'The {{ field }} should end with given letters ({{ argument }}).',
    exists: 'The {{ field }} should exists in table {{ argument }}',
    equals: 'The {{ field }} should should equal {{ values }}.',
    in: 'The {{ field }} should fall within defined values of ({{ argument }}).',
    includes: 'The {{ field }} should include define letters ({{ argument }}).',
    integer: 'The {{ field }} should be an INTEGER.',
    ip: 'The {{ field }} should be a valid IP address.',
    ipv4: 'The {{ field }} should be a valid IPV4 address.',
    ipv6: 'The {{ field }} should be a valid IPV6 address.',
    json: 'The {{ field }} should be a valid JSON string.',
    max: 'The {{ field }} should not be more than {{ argument.0 }}.',
    min: 'The {{ field }} should not be less than {{ argument.0 }}.',
    not_equals: 'The {{ field }} should be different than {{ argument.0 }}.',
    not_in: 'The {{ field }} should not be one of ({{ argument }}).',
    number: 'The {{ field }} should be an number.',
    object: 'The {{ field }} should be a valid OBJECT.',
    range: 'The {{ field }} should be between {{ argument.0 }} and {{ argument.1 }}.',
    regex: 'The {{ field }} format is invalid.',
    required: 'The {{ field }} is required.',
    required_if: 'The {{ field }} is required when {{ argument.0 }} exist.',
    required_when:
        'The {{ field }} is required when value of {{ argument.0 }} is equal to {{ argument.1 }}',
    required_with_all:
        'The {{ field }} is required when all of ({{ argument }}) are present.',
    required_with_any:
        'The {{ field }} is required when any of ({{ argument }}) are present.',
    required_without_all:
        'The {{ field }} is required when none of ({{ argument }}) are present.',
    required_without_any:
        'The {{ field }} is required when any of ({{ argument }}) are present.',
    same: 'The {{ field }} and {{ argument.0 }} should match.',
    starts_with: 'The {{ field }} should starts with given letters ({{ argument }}).',
    string: 'The {{ field }} should be a STRING.',
    under: 'The {{ field }} should be under {{ argument.0 }}.',
    unique: 'The {{ field }} has already been taken by someone else.',
    url: 'The {{ field }} should be a valid URL.'
};
