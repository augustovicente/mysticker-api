export const validationMessage = {
    above: '{{ field }} deve ser maior de {{ argument.0 }}.',
    accepted: '{{ field }} deve ser aceito.',
    after: '{{ field }} deve ser uma data posterior à {{ argument.0 }}',
    after_offset_of:
        '{{ field }} deve ser posterior à {{ argument.0 }} {{ argument.1 }} da data de hoje.',
    alpha: '{{ field }} deve conter apenas letras.',
    alpha_numeric: '{{ field }} deve conter apenas letras e números.',
    array: '{{ field }} deve ser um array.',
    before: '{{ field }} deve ser uma data anterior à {{ argument.0 }}.',
    before_offset_of:
        '{{ field }} deve ser anterior à {{ argument.0 }} {{ argument.1 }} da data de hoje.',
    between: '{{ field }} deve estar entre {{ argument.0 }} e {{ argument.1 }}.',
    boolean: '{{ field }} deve ser true ou false.',
    confirmed: '{{ field }} confirmação não confere.',
    date: '{{ field }} deve ser uma data válida.',
    date_format:
        '{{ field }} deve ser uma data válida de acordo com o formato {{ argument.0 }}.',
    different: '{{ field }} e {{ argument.0 }} devem ser diferentes.',
    email: '{{ field }} deve ser um endereço de e-mail válido.',
    ends_with: '{{ field }} deve terminar com ({{ argument }}).',
    equals: '{{ field }} deve ser igual a {{ argument.0 }}.',
    exists: '{{ field }} deve existir na tabela {{ argument.0 }}.',
    file: '{{ field }} deve conter um arquivo.',
    file_ext: '{{ field }} deve conter um arquivo.',
    file_size: '{{ field }} deve conter um arquivo.',
    file_types: '{{ field }} deve conter um arquivo.',
    in: '{{ field }} deve ser um dos valores ({{ argument }}).',
    includes: '{{ field }} deve incluir ({{ argument }}).',
    integer: '{{ field }} deve ser um inteiro.',
    ip: '{{ field }} deve ser um endereço de IP válido.',
    ipv4: '{{ field }} deve ser um endereço de IPV4 válido.',
    ipv6: '{{ field }} deve ser um endereço de IPV6 válido.',
    json: '{{ field }} deve ser uma string JSON válida.',
    maxLength: '{{ field }} não deve ser maior que {{ options.maxLength }}.',
    minLength: '{{ field }} não deve ser menor que {{ options.minLength }}.',
    not_contains_at_least:
        'O array {{ field }} deve conter ao menos {{ argument.0 }} item que não seja {{ argument.1 }}.',
    not_equals: '{{ field }} deve ser diferente de {{ argument.0 }}.',
    not_in: '{{ field }} não deve ser um dos valores ({{ argument }}).',
    object: '{{ field }} deve ser um objeto válido.',
    range: '{{ field }} deve estar entre {{ argument.0 }} e {{ argument.1 }}.',
    regex: 'O formato de {{ field }} é inválido.',
    required: '{{ field }} é obrigatório.',
    required_if: '{{ field }} é obrigatório quando {{ argument.0 }} existir.',
    required_when:
        '{{ field }} é obrigatório quando o valor de {{ argument.0 }} for igual a {{ argument.1 }}',
    required_with_all:
        '{{ field }} é obrigatório quando ({{ argument }}) estiverem presentes.',
    required_with_any:
        '{{ field }} é obrigatório quando algum de ({{ argument }}) estiver presente.',
    required_without_all:
        '{{ field }} é obrigatório quando nenhum de ({{ argument }}) estiver presente.',
    required_without_any:
        '{{ field }} é obrigatório quando algum de ({{ argument }}) não estiver presente.',
    same: '{{ field }} e {{ argument.0 }} devem corresponder.',
    starts_with: '{{ field }} deve começar com ({{ argument }}).',
    string: '{{ field }} deve ser uma string.',
    under: '{{ field }} deve ser menor de {{ argument.0 }}.',
    unique: '{{ field }} já está em uso.',
    url: '{{ field }} deve ser uma URL válida.'
};
